ALTER TABLE public.products ADD COLUMN IF NOT EXISTS diet_tags text[] NOT NULL DEFAULT '{}';

INSERT INTO public.products (id, name, category, unit, description, audio_description, image_emoji, image_url, diet_tags) VALUES
('notmilk-integral-1l','Bebida Vegetal Not Milk Integral','Bebidas','1 L','Bebida vegetal Not Milk integral, sabor parecido com leite.','Caixa de um litro de bebida vegetal Not Milk integral.','🥛','/produtos/notmilk-integral-1l.png','{vegano,sem-lactose}'),
('ades-soja-original-1l','Bebida Vegetal AdeS Soja Original','Bebidas','1 L','Bebida de soja AdeS original, fonte de proteína vegetal.','Caixa de um litro de bebida de soja AdeS original.','🥛','/produtos/ades-soja-original-1l.png','{vegano,sem-lactose}'),
('bebida-tal-da-castanha-1l','Bebida Vegetal A Tal da Castanha Original','Bebidas','1 L','Bebida de castanha-de-caju original, sem lactose.','Caixa de um litro de bebida vegetal de castanha A Tal da Castanha.','🥛','/produtos/bebida-tal-da-castanha-1l.png','{vegano,sem-lactose}'),
('carne-moida-vegetal-ff-270g','Carne Moída Vegetal Fazenda Futuro','Congelados','270 g','Carne moída 100% vegetal congelada da Fazenda Futuro.','Pacote de duzentos e setenta gramas de carne moída vegetal Fazenda Futuro.','🌱','/produtos/carne-moida-vegetal-ff-270g.png','{vegano,sem-lactose}'),
('hamburguer-vegetal-ff-230g','Hambúrguer Vegetal Fazenda Futuro','Congelados','230 g','Dois hambúrgueres 100% vegetais da Fazenda Futuro.','Caixa de duzentos e trinta gramas de hambúrguer vegetal Fazenda Futuro.','🌱','/produtos/hamburguer-vegetal-ff-230g.png','{vegano,sem-lactose}'),
('queijo-mussarela-caju-vidaveg-300g','Queijo Vegano Mussarela de Castanha Vida Veg','Frios e Laticínios','300 g','Queijo vegano tipo mussarela feito de castanha de caju.','Peça de trezentos gramas de queijo vegano de castanha Vida Veg.','🧀','/produtos/queijo-mussarela-caju-vidaveg-300g.png','{vegano,sem-lactose}'),
('queijo-fatiado-prato-vidaveg-150g','Queijo Vegano Fatiado sabor Prato Vida Veg','Frios e Laticínios','150 g','Fatias de queijo vegano sabor prato, ideal para sanduíches.','Pacote de cento e cinquenta gramas de queijo vegano fatiado Vida Veg.','🧀','/produtos/queijo-fatiado-prato-vidaveg-150g.png','{vegano,sem-lactose}'),
('creme-vegetal-becel-250g','Creme Vegetal Becel com Sal','Frios e Laticínios','250 g','Creme vegetal Becel com sal, de origem vegetal.','Pote de duzentos e cinquenta gramas de creme vegetal Becel.','🧈','/produtos/creme-vegetal-becel-250g.png','{vegano}'),
('manteiga-coco-qualicoco-200g','Manteiga de Coco com Sal Qualicoco','Frios e Laticínios','200 g','Manteiga de coco com sal, alternativa vegetal à manteiga.','Pote de duzentos gramas de manteiga de coco Qualicoco.','🥥','/produtos/manteiga-coco-qualicoco-200g.png','{vegano,sem-lactose,sem-gluten}'),
('chocolate-talento-amendoas-85g','Chocolate Talento Meio Amargo com Amêndoas','Doces e Snacks','85 g','Barra de chocolate meio amargo com amêndoas, sem leite.','Barra de oitenta e cinco gramas de chocolate Talento meio amargo com amêndoas.','🍫','/produtos/chocolate-talento-amendoas-85g.png','{vegano,sem-lactose}'),
('bolo-chocolate-jasmine-300g','Bolo de Chocolate Jasmine Sem Glúten','Padaria','300 g','Bolo de chocolate sem glúten e sem ingredientes de origem animal.','Caixa de trezentos gramas de bolo de chocolate Jasmine sem glúten.','🍰','/produtos/bolo-chocolate-jasmine-300g.png','{vegano,sem-gluten,sem-lactose}'),
('geleia-linea-frutas-vermelhas-230g','Geleia de Frutas Vermelhas Linea Zero Açúcar','Mercearia','230 g','Geleia de frutas vermelhas sem adição de açúcar.','Pote de duzentos e trinta gramas de geleia Linea zero açúcar.','🍓','/produtos/geleia-linea-frutas-vermelhas-230g.png','{zero-acucar,vegano,sem-gluten,sem-lactose}'),
('geleia-queensberry-morango-250g','Geleia de Morango Queensberry 100% Fruit','Mercearia','250 g','Geleia de morango feita só com fruta, sem açúcar adicionado.','Pote de duzentos e cinquenta gramas de geleia Queensberry cem por cento fruta.','🍓','/produtos/geleia-queensberry-morango-250g.png','{zero-acucar,vegano,sem-gluten,sem-lactose}'),
('bananada-flormel-20un','Bananada Cremosa Zero Açúcar Flormel','Doces e Snacks','20 un de 22 g','Display com vinte bananadas cremosas sem açúcar.','Display com vinte unidades de bananada cremosa Flormel zero açúcar.','🍌','/produtos/bananada-flormel-20un.png','{zero-acucar,vegano,sem-gluten,sem-lactose}'),
('gelatina-royal-morango-zero-12g','Gelatina em Pó Royal Morango Zero Açúcar','Doces e Snacks','12 g','Gelatina em pó sabor morango sem açúcar.','Sachê de doze gramas de gelatina Royal morango zero açúcar.','🍮','/produtos/gelatina-royal-morango-zero-12g.png','{zero-acucar,sem-gluten,sem-lactose}'),
('achocolatado-sweet-diet-200g','Achocolatado em Pó Gold Premium Sweet Diet','Bebidas','200 g','Achocolatado em pó dietético, sem adição de açúcar.','Pote de duzentos gramas de achocolatado Sweet diet.','🍫','/produtos/achocolatado-sweet-diet-200g.png','{zero-acucar}'),
('adocante-stevia-forno-fogao-1kg','Adoçante Culinário com Stevia Forno e Fogão','Mercearia','1 kg','Adoçante dietético com stevia para uso culinário.','Pacote de um quilo de adoçante culinário com stevia.','🥄','/produtos/adocante-stevia-forno-fogao-1kg.png','{zero-acucar,vegano,sem-gluten,sem-lactose}'),
('pao-wickbold-sem-gluten-300g','Pão de Forma Wickbold Sem Glúten Tradicional','Padaria','300 g','Pão de forma tradicional sem glúten.','Pacote de trezentos gramas de pão de forma Wickbold sem glúten.','🍞','/produtos/pao-wickbold-sem-gluten-300g.png','{sem-gluten}'),
('torrada-veg-aminna-90g','Torrada VEG Integral Aminna','Padaria','90 g','Torrada integral vegana e sem glúten.','Pacote de noventa gramas de torrada integral Aminna.','🍞','/produtos/torrada-veg-aminna-90g.png','{sem-gluten,vegano,sem-lactose}'),
('macarrao-arroz-urbano-500g','Macarrão de Arroz Urbano Espaguete Integral','Mercearia','500 g','Macarrão de arroz integral, sem glúten.','Pacote de quinhentos gramas de macarrão de arroz Urbano.','🍝','/produtos/macarrao-arroz-urbano-500g.png','{sem-gluten,vegano,sem-lactose}'),
('cookies-jasmine-gotas-150g','Cookies Integrais Sem Glúten Jasmine Gotas de Chocolate','Doces e Snacks','150 g','Cookies integrais sem glúten com gotas de chocolate.','Pacote de cento e cinquenta gramas de cookies Jasmine sem glúten.','🍪','/produtos/cookies-jasmine-gotas-150g.png','{sem-gluten}'),
('biscoito-sou-sweet-jasmine-75g','Biscoito Vegano Chocolate e Gotas Zero Açúcar Sou Sweet','Doces e Snacks','75 g','Biscoito vegano de chocolate sem glúten e sem açúcar.','Pacote de setenta e cinco gramas de biscoito vegano Sou Sweet.','🍪','/produtos/biscoito-sou-sweet-jasmine-75g.png','{sem-gluten,vegano,zero-acucar,sem-lactose}'),
('farinha-schar-mix-it-500g','Farinha Multiuso Sem Glúten Schär Mix It','Mercearia','500 g','Mistura de farinhas multiuso sem glúten.','Pacote de quinhentos gramas de farinha Schär Mix It sem glúten.','🌾','/produtos/farinha-schar-mix-it-500g.png','{sem-gluten}'),
('mix-farinhas-urbano-1kg','Mix de Farinhas Sem Glúten Urbano','Mercearia','1 kg','Mix de farinhas sem glúten para bolos e pães.','Pacote de um quilo de mix de farinhas Urbano sem glúten.','🌾','/produtos/mix-farinhas-urbano-1kg.png','{sem-gluten,vegano,sem-lactose}'),
('leite-itambe-nolac-1l','Leite UHT Integral Itambé Nolac Zero Lactose','Frios e Laticínios','1 L','Leite integral zero lactose Itambé Nolac.','Caixa de um litro de leite Itambé Nolac zero lactose.','🥛','/produtos/leite-itambe-nolac-1l.png','{sem-lactose}'),
('doce-leite-piracanjuba-zl-395g','Doce de Leite Piracanjuba Zero Lactose','Doces e Snacks','395 g','Doce de leite cremoso sem lactose.','Pote de trezentos e noventa e cinco gramas de doce de leite Piracanjuba zero lactose.','🍯','/produtos/doce-leite-piracanjuba-zl-395g.png','{sem-lactose}'),
('leite-condensado-moca-sl-395g','Leite Condensado Moça Sem Lactose','Mercearia','395 g','Leite condensado Moça sem lactose em lata.','Lata de trezentos e noventa e cinco gramas de leite condensado Moça sem lactose.','🥫','/produtos/leite-condensado-moca-sl-395g.png','{sem-lactose}'),
('requeijao-tirolez-zl-200g','Requeijão Cremoso Tirolez Zero Lactose','Frios e Laticínios','200 g','Requeijão cremoso sem lactose no copo.','Copo de duzentos gramas de requeijão Tirolez zero lactose.','🧈','/produtos/requeijao-tirolez-zl-200g.png','{sem-lactose,sem-gluten}'),
('queijo-minas-frescal-zl-kg','Queijo Minas Frescal Fazenda Bela Vista Zero Lactose','Frios e Laticínios','kg','Queijo minas frescal sem lactose vendido por quilo.','Peça de queijo minas frescal zero lactose Fazenda Bela Vista.','🧀','/produtos/queijo-minas-frescal-zl-kg.png','{sem-lactose,sem-gluten}'),
('manteiga-president-zl-200g','Manteiga com Sal Président Zero Lactose','Frios e Laticínios','200 g','Manteiga com sal sem lactose Président.','Pote de duzentos gramas de manteiga Président zero lactose.','🧈','/produtos/manteiga-president-zl-200g.png','{sem-lactose,sem-gluten}'),
('iogurte-activia-morango-zl-170g','Iogurte Danone Activia Morango Zero Lactose','Frios e Laticínios','170 g','Iogurte de morango sem lactose com fibras.','Pote de cento e setenta gramas de iogurte Activia morango zero lactose.','🥣','/produtos/iogurte-activia-morango-zl-170g.png','{sem-lactose}'),
('iogurte-lacfree-natural-140g','Iogurte Natural Desnatado Verde Campo Lacfree','Frios e Laticínios','140 g','Iogurte natural desnatado sem lactose e sem açúcar adicionado.','Pote de cento e quarenta gramas de iogurte natural Lacfree.','🥣','/produtos/iogurte-lacfree-natural-140g.png','{sem-lactose,zero-acucar,sem-gluten}');

INSERT INTO public.product_stocks (product_id, store_id, price, promo_price, stock)
SELECT p.id, s.store_id, round((p.base * s.factor)::numeric, 2),
       CASE WHEN p.promo AND s.store_id = 'mercado-da-vila' THEN round((p.base * s.factor * 0.82)::numeric, 2) ELSE NULL END,
       s.stock
FROM (VALUES
  ('notmilk-integral-1l', 14.90, true),
  ('ades-soja-original-1l', 9.49, true),
  ('bebida-tal-da-castanha-1l', 19.90, false),
  ('carne-moida-vegetal-ff-270g', 24.90, true),
  ('hamburguer-vegetal-ff-230g', 22.90, false),
  ('queijo-mussarela-caju-vidaveg-300g', 32.90, false),
  ('queijo-fatiado-prato-vidaveg-150g', 21.90, true),
  ('creme-vegetal-becel-250g', 12.90, false),
  ('manteiga-coco-qualicoco-200g', 18.90, false),
  ('chocolate-talento-amendoas-85g', 8.99, true),
  ('bolo-chocolate-jasmine-300g', 23.90, false),
  ('geleia-linea-frutas-vermelhas-230g', 13.90, true),
  ('geleia-queensberry-morango-250g', 19.90, false),
  ('bananada-flormel-20un', 34.90, true),
  ('gelatina-royal-morango-zero-12g', 3.49, false),
  ('achocolatado-sweet-diet-200g', 16.90, false),
  ('adocante-stevia-forno-fogao-1kg', 24.90, true),
  ('pao-wickbold-sem-gluten-300g', 17.90, true),
  ('torrada-veg-aminna-90g', 11.90, false),
  ('macarrao-arroz-urbano-500g', 12.90, false),
  ('cookies-jasmine-gotas-150g', 13.90, true),
  ('biscoito-sou-sweet-jasmine-75g', 9.90, false),
  ('farinha-schar-mix-it-500g', 34.90, false),
  ('mix-farinhas-urbano-1kg', 19.90, true),
  ('leite-itambe-nolac-1l', 7.49, true),
  ('doce-leite-piracanjuba-zl-395g', 14.90, false),
  ('leite-condensado-moca-sl-395g', 8.99, true),
  ('requeijao-tirolez-zl-200g', 11.90, false),
  ('queijo-minas-frescal-zl-kg', 44.90, false),
  ('manteiga-president-zl-200g', 21.90, true),
  ('iogurte-activia-morango-zl-170g', 4.29, false),
  ('iogurte-lacfree-natural-140g', 3.99, true)
) AS p(id, base, promo)
CROSS JOIN (VALUES
  ('mercado-da-vila', 1.00, 18),
  ('super-vale-jardim', 1.06, 12),
  ('mega-hiper-norte', 0.97, 25)
) AS s(store_id, factor, stock);

UPDATE public.products SET diet_tags = '{vegano,sem-gluten,sem-lactose,zero-acucar}'
WHERE category = 'Frutas e Verduras';

UPDATE public.products SET diet_tags = '{vegano,sem-gluten,sem-lactose,zero-acucar}'
WHERE id IN ('arroz-branco-5kg','feijao-carioca-1kg','sal-refinado-1kg','agua-mineral-1500ml','oleo-soja-900ml','vinagre-750ml','cafe-torrado-500g','cafe-soluvel-100g','milho-verde-200g','ervilha-200g');

UPDATE public.products SET diet_tags = '{vegano,sem-lactose}'
WHERE id IN ('macarrao-espaguete-500g','farinha-trigo-1kg','molho-tomate-340g','aveia-flocos-200g','cha-mate-1l','suco-laranja-1l');

UPDATE public.products SET diet_tags = '{sem-gluten,zero-acucar}'
WHERE id IN ('ovos-brancos-12','peito-frango-kg','coxa-frango-kg','carne-moida-kg','picanha-kg','file-tilapia-kg','costela-suina-kg');
