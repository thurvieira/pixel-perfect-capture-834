ALTER TABLE public.product_stocks ADD COLUMN IF NOT EXISTS promo_price NUMERIC(10,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'confirmado';

UPDATE public.product_stocks
SET promo_price = round((price * (0.70 + ((abs(hashtext(product_id || store_id)) % 15)::numeric / 100)))::numeric, 2)
WHERE abs(hashtext(product_id || store_id || 'promo')) % 100 < 22
  AND stock > 0;

CREATE OR REPLACE FUNCTION public.check_cart_availability(p_items jsonb)
RETURNS TABLE (product_id text, store_id text, requested integer, available integer, unit_price numeric, is_available boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.product_id,
         i.store_id,
         i.quantity,
         COALESCE(s.stock, 0),
         COALESCE(s.promo_price, s.price),
         COALESCE(s.stock, 0) >= i.quantity
  FROM jsonb_to_recordset(p_items) AS i(product_id text, store_id text, quantity integer)
  LEFT JOIN public.product_stocks s
    ON s.product_id = i.product_id AND s.store_id = i.store_id;
$$;

GRANT EXECUTE ON FUNCTION public.check_cart_availability(jsonb) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.place_order(p_mode public.order_mode, p_items jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_order_id uuid;
  v_item record;
  v_price numeric;
  v_total numeric := 0;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Faça login para finalizar o pedido.';
  END IF;

  INSERT INTO public.orders (user_id, order_mode, total, status)
  VALUES (v_user, p_mode, 0, 'confirmado')
  RETURNING id INTO v_order_id;

  FOR v_item IN
    SELECT * FROM jsonb_to_recordset(p_items) AS i(product_id text, store_id text, quantity integer)
  LOOP
    UPDATE public.product_stocks s
    SET stock = s.stock - v_item.quantity
    WHERE s.product_id = v_item.product_id
      AND s.store_id = v_item.store_id
      AND s.stock >= v_item.quantity
    RETURNING COALESCE(s.promo_price, s.price) INTO v_price;

    IF v_price IS NULL THEN
      RAISE EXCEPTION 'Estoque insuficiente para o item %', v_item.product_id;
    END IF;

    INSERT INTO public.order_items (order_id, user_id, product_id, store_id, quantity, unit_price)
    VALUES (v_order_id, v_user, v_item.product_id, v_item.store_id, v_item.quantity, v_price);

    v_total := v_total + (v_price * v_item.quantity);
  END LOOP;

  UPDATE public.orders SET total = v_total WHERE id = v_order_id;
  RETURN v_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order(public.order_mode, jsonb) TO authenticated, service_role;