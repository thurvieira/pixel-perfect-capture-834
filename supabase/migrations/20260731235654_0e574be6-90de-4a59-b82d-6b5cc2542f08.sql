CREATE TYPE public.store_type AS ENUM ('supermercado', 'hipermercado', 'atacadista');
CREATE TYPE public.order_mode AS ENUM ('delivery', 'pickup', 'lookup');

CREATE TABLE public.stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  network TEXT NOT NULL,
  type public.store_type NOT NULL,
  address TEXT NOT NULL,
  distance_km NUMERIC(5,1) NOT NULL DEFAULT 0,
  delivery_available BOOLEAN NOT NULL DEFAULT true,
  pickup_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.stores TO anon;
GRANT SELECT ON public.stores TO authenticated;
GRANT ALL ON public.stores TO service_role;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stores are publicly viewable" ON public.stores FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  audio_description TEXT NOT NULL DEFAULT '',
  image_emoji TEXT NOT NULL DEFAULT '🛒',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are publicly viewable" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.product_stocks (
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, store_id)
);
GRANT SELECT ON public.product_stocks TO anon;
GRANT SELECT ON public.product_stocks TO authenticated;
GRANT ALL ON public.product_stocks TO service_role;
ALTER TABLE public.product_stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stock is publicly viewable" ON public.product_stocks FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_mode public.order_mode NOT NULL DEFAULT 'delivery',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  store_id TEXT NOT NULL REFERENCES public.stores(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

INSERT INTO public.stores (id, name, network, type, address, distance_km, delivery_available, pickup_available) VALUES
  ('bom-preco-centro', 'Bom Preço Centro', 'Rede Bom Preço', 'supermercado', 'Av. Central, 1200 - Centro', 1.2, true, true),
  ('super-vale-jardim', 'Super Vale Jardim', 'Rede Super Vale', 'supermercado', 'Rua das Acácias, 45 - Jardim América', 2.4, true, true),
  ('mega-hiper-norte', 'Mega Hiper Norte', 'Mega Hiper', 'hipermercado', 'Rod. BR-101, km 12 - Zona Norte', 5.8, true, true),
  ('atacadao-uniao', 'Atacado União', 'União Atacado', 'atacadista', 'Av. Industrial, 3000 - Distrito', 8.3, false, true),
  ('mercado-da-vila', 'Mercado da Vila', 'Independente', 'supermercado', 'Rua São João, 88 - Vila Nova', 0.7, true, true);

INSERT INTO public.products (id, name, category, unit, description, audio_description, image_emoji) VALUES
  ('arroz-branco-5kg', 'Arroz branco tipo 1', 'Mercearia', 'Pacote 5 kg', 'Arroz branco tipo 1, grãos longos e soltos, ideal para o dia a dia.', 'Arroz branco tipo 1, pacote de cinco quilos. Grãos longos e soltos, ideal para o preparo diário.', '🍚'),
  ('feijao-carioca-1kg', 'Feijão carioca', 'Mercearia', 'Pacote 1 kg', 'Feijão carioca selecionado, cozimento rápido e caldo cremoso.', 'Feijão carioca, pacote de um quilo. Grãos selecionados, com cozimento rápido e caldo cremoso.', '🫘'),
  ('leite-integral-1l', 'Leite integral UHT', 'Frios e Laticínios', 'Caixa 1 litro', 'Leite integral longa vida, fonte de cálcio e proteínas.', 'Leite integral longa vida, caixa de um litro. Fonte de cálcio e proteínas.', '🥛'),
  ('cafe-torrado-500g', 'Café torrado e moído', 'Mercearia', 'Pacote 500 g', 'Café torrado e moído, torra média, aroma intenso.', 'Café torrado e moído, pacote de quinhentos gramas, torra média com aroma intenso.', '☕'),
  ('acucar-refinado-1kg', 'Açúcar refinado', 'Mercearia', 'Pacote 1 kg', 'Açúcar refinado de granulação fina, dissolve com facilidade.', 'Açúcar refinado, pacote de um quilo, granulação fina que dissolve com facilidade.', '🍬'),
  ('oleo-soja-900ml', 'Óleo de soja', 'Mercearia', 'Garrafa 900 ml', 'Óleo de soja refinado para frituras e preparos do dia a dia.', 'Óleo de soja refinado, garrafa de novecentos mililitros, indicado para frituras e preparos diários.', '🛢️'),
  ('banana-prata-kg', 'Banana prata', 'Frutas e Verduras', 'Por quilo', 'Banana prata madura, doce e rica em potássio.', 'Banana prata vendida por quilo, madura, doce e rica em potássio.', '🍌'),
  ('tomate-kg', 'Tomate salada', 'Frutas e Verduras', 'Por quilo', 'Tomate salada firme, ideal para saladas e molhos.', 'Tomate salada vendido por quilo, firme, ideal para saladas e molhos.', '🍅'),
  ('peito-frango-kg', 'Peito de frango', 'Carnes', 'Por quilo', 'Peito de frango sem osso, refrigerado, embalado na bandeja.', 'Peito de frango sem osso, vendido por quilo, refrigerado e embalado em bandeja.', '🍗'),
  ('paozinho-kg', 'Pão francês', 'Padaria', 'Por quilo', 'Pão francês assado no dia, casca crocante e miolo macio.', 'Pão francês assado no dia, vendido por quilo, com casca crocante e miolo macio.', '🥖'),
  ('detergente-500ml', 'Detergente neutro', 'Limpeza', 'Frasco 500 ml', 'Detergente neutro concentrado, rende mais na louça.', 'Detergente neutro concentrado, frasco de quinhentos mililitros, com alto rendimento na louça.', '🧼'),
  ('papel-higienico-12', 'Papel higiênico folha dupla', 'Higiene', 'Pacote 12 rolos', 'Papel higiênico folha dupla, 30 metros por rolo.', 'Papel higiênico folha dupla, pacote com doze rolos de trinta metros cada.', '🧻');

INSERT INTO public.product_stocks (product_id, store_id, price, stock) VALUES
  ('arroz-branco-5kg', 'bom-preco-centro', 27.90, 40),
  ('arroz-branco-5kg', 'mega-hiper-norte', 25.49, 120),
  ('arroz-branco-5kg', 'atacadao-uniao', 23.90, 300),
  ('feijao-carioca-1kg', 'bom-preco-centro', 8.49, 60),
  ('feijao-carioca-1kg', 'super-vale-jardim', 7.99, 45),
  ('feijao-carioca-1kg', 'atacadao-uniao', 6.95, 500),
  ('leite-integral-1l', 'mercado-da-vila', 5.29, 24),
  ('leite-integral-1l', 'super-vale-jardim', 4.99, 90),
  ('leite-integral-1l', 'mega-hiper-norte', 4.79, 200),
  ('cafe-torrado-500g', 'bom-preco-centro', 18.90, 30),
  ('cafe-torrado-500g', 'atacadao-uniao', 16.49, 180),
  ('acucar-refinado-1kg', 'mercado-da-vila', 4.99, 18),
  ('acucar-refinado-1kg', 'mega-hiper-norte', 4.29, 150),
  ('oleo-soja-900ml', 'super-vale-jardim', 7.49, 0),
  ('oleo-soja-900ml', 'mega-hiper-norte', 6.99, 110),
  ('banana-prata-kg', 'mercado-da-vila', 6.49, 35),
  ('banana-prata-kg', 'bom-preco-centro', 5.99, 50),
  ('tomate-kg', 'super-vale-jardim', 8.99, 28),
  ('tomate-kg', 'mega-hiper-norte', 7.49, 80),
  ('peito-frango-kg', 'bom-preco-centro', 19.90, 22),
  ('peito-frango-kg', 'atacadao-uniao', 17.49, 140),
  ('paozinho-kg', 'mercado-da-vila', 14.90, 12),
  ('paozinho-kg', 'bom-preco-centro', 15.90, 20),
  ('detergente-500ml', 'super-vale-jardim', 2.79, 70),
  ('detergente-500ml', 'atacadao-uniao', 2.19, 400),
  ('papel-higienico-12', 'mega-hiper-norte', 24.90, 65),
  ('papel-higienico-12', 'atacadao-uniao', 21.90, 220);