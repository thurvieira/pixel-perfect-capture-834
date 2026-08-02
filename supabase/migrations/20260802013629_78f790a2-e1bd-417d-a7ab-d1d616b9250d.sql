ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';

WITH seed(id, name, category, unit, description, audio_description, image_emoji, kw, base_price) AS (
  VALUES
  -- Mercearia
  ('macarrao-espaguete-500g','Macarrão espaguete','Mercearia','Pacote 500 g','Massa de sêmola de trigo para o dia a dia.','Pacote de macarrão espaguete de quinhentos gramas.','🍝','spaghetti,pasta',4.79),
  ('molho-tomate-340g','Molho de tomate','Mercearia','Sachê 340 g','Molho de tomate tradicional pronto para uso.','Sachê de molho de tomate de trezentos e quarenta gramas.','🥫','tomato,sauce',3.29),
  ('farinha-trigo-1kg','Farinha de trigo','Mercearia','Pacote 1 kg','Farinha de trigo enriquecida para bolos e pães.','Pacote de farinha de trigo de um quilo.','🌾','flour,baking',5.49),
  ('sal-refinado-1kg','Sal refinado iodado','Mercearia','Pacote 1 kg','Sal refinado iodado de mesa.','Pacote de sal refinado de um quilo.','🧂','salt,kitchen',2.49),
  ('vinagre-750ml','Vinagre de álcool','Mercearia','Garrafa 750 ml','Vinagre de álcool para saladas e conservas.','Garrafa de vinagre de setecentos e cinquenta mililitros.','🍶','vinegar,bottle',3.19),
  ('atum-lata-170g','Atum ralado em óleo','Mercearia','Lata 170 g','Atum ralado pronto para saladas e sanduíches.','Lata de atum ralado de cento e setenta gramas.','🐟','canned,tuna',8.49),
  ('sardinha-lata-125g','Sardinha em óleo','Mercearia','Lata 125 g','Sardinha em conserva no óleo comestível.','Lata de sardinha de cento e vinte e cinco gramas.','🐠','sardines,can',5.99),
  ('milho-verde-200g','Milho verde em conserva','Mercearia','Lata 200 g','Grãos de milho verde em conserva.','Lata de milho verde de duzentos gramas.','🌽','sweetcorn,can',3.89),
  ('ervilha-200g','Ervilha em conserva','Mercearia','Lata 200 g','Ervilhas em conserva prontas para uso.','Lata de ervilha de duzentos gramas.','🫛','green,peas',3.79),
  ('aveia-flocos-200g','Aveia em flocos','Mercearia','Pacote 200 g','Aveia em flocos finos rica em fibras.','Pacote de aveia em flocos de duzentos gramas.','🥣','oat,flakes',6.29),
  ('achocolatado-400g','Achocolatado em pó','Mercearia','Pote 400 g','Achocolatado em pó vitaminado.','Pote de achocolatado em pó de quatrocentos gramas.','🍫','chocolate,powder',9.99),
  -- Bebidas
  ('refrigerante-cola-2l','Refrigerante de cola','Bebidas','Garrafa 2 litros','Refrigerante sabor cola bem gelado.','Garrafa de refrigerante de cola de dois litros.','🥤','cola,soda',8.99),
  ('suco-laranja-1l','Suco de laranja integral','Bebidas','Caixa 1 litro','Suco de laranja integral sem adição de açúcar.','Caixa de suco de laranja de um litro.','🍊','orange,juice',9.49),
  ('agua-mineral-1500ml','Água mineral sem gás','Bebidas','Garrafa 1,5 litro','Água mineral natural sem gás.','Garrafa de água mineral de um litro e meio.','💧','water,bottle',2.79),
  ('cerveja-lata-350ml','Cerveja pilsen lata','Bebidas','Lata 350 ml','Cerveja pilsen leve e refrescante.','Lata de cerveja pilsen de trezentos e cinquenta mililitros.','🍺','beer,can',4.29),
  ('cha-mate-1l','Chá mate natural','Bebidas','Garrafa 1 litro','Chá mate pronto para beber.','Garrafa de chá mate de um litro.','🧉','iced,tea',7.19),
  ('cafe-soluvel-100g','Café solúvel','Bebidas','Vidro 100 g','Café solúvel granulado tradicional.','Vidro de café solúvel de cem gramas.','☕','instant,coffee',13.90),
  -- Frutas e Verduras
  ('maca-gala-kg','Maçã gala','Frutas e Verduras','Por quilo','Maçã gala crocante e doce.','Maçã gala vendida por quilo.','🍎','apple,fruit',8.99),
  ('laranja-pera-kg','Laranja pera','Frutas e Verduras','Por quilo','Laranja pera suculenta para suco.','Laranja pera vendida por quilo.','🍊','orange,fruit',4.49),
  ('mamao-formosa-kg','Mamão formosa','Frutas e Verduras','Por quilo','Mamão formosa maduro e doce.','Mamão formosa vendido por quilo.','🍈','papaya,fruit',6.79),
  ('batata-inglesa-kg','Batata inglesa','Frutas e Verduras','Por quilo','Batata inglesa lavada, ideal para fritar.','Batata inglesa vendida por quilo.','🥔','potato,vegetable',5.29),
  ('cebola-kg','Cebola branca','Frutas e Verduras','Por quilo','Cebola branca de primeira qualidade.','Cebola branca vendida por quilo.','🧅','onion,vegetable',4.99),
  ('alho-kg','Alho nacional','Frutas e Verduras','Pacote 200 g','Cabeças de alho nacional selecionadas.','Pacote de alho de duzentos gramas.','🧄','garlic,vegetable',7.49),
  ('cenoura-kg','Cenoura','Frutas e Verduras','Por quilo','Cenoura fresca e crocante.','Cenoura vendida por quilo.','🥕','carrot,vegetable',4.39),
  ('alface-crespa-un','Alface crespa','Frutas e Verduras','Unidade','Pé de alface crespa hidropônica.','Alface crespa vendida por unidade.','🥬','lettuce,green',3.49),
  ('limao-taiti-kg','Limão taiti','Frutas e Verduras','Por quilo','Limão taiti fresco e suculento.','Limão taiti vendido por quilo.','🍋','lime,fruit',5.89),
  ('abacate-kg','Abacate','Frutas e Verduras','Por quilo','Abacate maduro cremoso.','Abacate vendido por quilo.','🥑','avocado,fruit',9.29),
  -- Carnes
  ('carne-moida-kg','Carne moída de patinho','Carnes','Por quilo','Patinho moído na hora, sem gordura aparente.','Carne moída de patinho vendida por quilo.','🥩','ground,beef',36.90),
  ('picanha-kg','Picanha bovina','Carnes','Por quilo','Peça de picanha maturada para churrasco.','Picanha bovina vendida por quilo.','🍖','picanha,steak',79.90),
  ('linguica-toscana-kg','Linguiça toscana','Carnes','Por quilo','Linguiça toscana suína temperada.','Linguiça toscana vendida por quilo.','🌭','sausage,grill',22.90),
  ('file-tilapia-kg','Filé de tilápia','Carnes','Por quilo','Filé de tilápia congelado sem espinhas.','Filé de tilápia vendido por quilo.','🐟','tilapia,fish',39.90),
  ('costela-suina-kg','Costela suína','Carnes','Por quilo','Costelinha suína ideal para assar.','Costela suína vendida por quilo.','🥓','pork,ribs',28.50),
  ('coxa-frango-kg','Coxa e sobrecoxa de frango','Carnes','Por quilo','Coxa e sobrecoxa de frango com osso.','Coxa e sobrecoxa de frango vendidas por quilo.','🍗','chicken,thigh',13.90),
  -- Frios e Laticínios
  ('queijo-mussarela-kg','Queijo mussarela fatiado','Frios e Laticínios','Por quilo','Mussarela fatiada na hora.','Queijo mussarela fatiado vendido por quilo.','🧀','mozzarella,cheese',44.90),
  ('presunto-kg','Presunto cozido','Frios e Laticínios','Por quilo','Presunto cozido magro fatiado.','Presunto cozido vendido por quilo.','🍖','ham,deli',32.90),
  ('requeijao-200g','Requeijão cremoso','Frios e Laticínios','Copo 200 g','Requeijão cremoso tradicional.','Copo de requeijão de duzentos gramas.','🧴','cream,cheese',7.99),
  ('manteiga-200g','Manteiga com sal','Frios e Laticínios','Pote 200 g','Manteiga extra com sal.','Pote de manteiga de duzentos gramas.','🧈','butter,dairy',12.90),
  ('iogurte-natural-170g','Iogurte natural','Frios e Laticínios','Pote 170 g','Iogurte natural integral.','Pote de iogurte natural de cento e setenta gramas.','🥛','yogurt,dairy',3.59),
  ('ovos-brancos-12','Ovos brancos','Frios e Laticínios','Cartela 12 unidades','Ovos brancos grandes de granja.','Cartela com doze ovos brancos.','🥚','eggs,carton',14.90),
  -- Padaria
  ('pao-forma-500g','Pão de forma integral','Padaria','Pacote 500 g','Pão de forma integral macio.','Pacote de pão de forma integral de quinhentos gramas.','🍞','bread,loaf',9.49),
  ('bolo-cenoura-un','Bolo de cenoura caseiro','Padaria','Unidade 500 g','Bolo de cenoura com cobertura de chocolate.','Bolo de cenoura de quinhentos gramas.','🍰','carrot,cake',18.90),
  ('pao-queijo-kg','Pão de queijo','Padaria','Por quilo','Pão de queijo assado na hora.','Pão de queijo vendido por quilo.','🧆','cheese,bread',32.90),
  -- Congelados
  ('pizza-congelada-460g','Pizza congelada de mussarela','Congelados','Unidade 460 g','Pizza congelada sabor mussarela.','Pizza congelada de quatrocentos e sessenta gramas.','🍕','frozen,pizza',19.90),
  ('batata-congelada-2kg','Batata palito congelada','Congelados','Pacote 2 kg','Batata palito pré-frita congelada.','Pacote de batata palito congelada de dois quilos.','🍟','french,fries',28.90),
  ('sorvete-2l','Sorvete de creme','Congelados','Pote 2 litros','Sorvete de creme cremoso.','Pote de sorvete de creme de dois litros.','🍨','ice,cream',22.90),
  -- Doces e Snacks
  ('biscoito-recheado-130g','Biscoito recheado de chocolate','Doces e Snacks','Pacote 130 g','Biscoito recheado sabor chocolate.','Pacote de biscoito recheado de cento e trinta gramas.','🍪','cookies,chocolate',3.49),
  ('salgadinho-milho-100g','Salgadinho de milho','Doces e Snacks','Pacote 100 g','Salgadinho de milho crocante.','Pacote de salgadinho de milho de cem gramas.','🍿','corn,snack',7.29),
  ('chocolate-barra-90g','Chocolate ao leite em barra','Doces e Snacks','Barra 90 g','Barra de chocolate ao leite.','Barra de chocolate ao leite de noventa gramas.','🍫','chocolate,bar',8.49),
  -- Limpeza
  ('sabao-po-1kg','Sabão em pó','Limpeza','Pacote 1 kg','Sabão em pó para máquina e tanque.','Pacote de sabão em pó de um quilo.','🧺','laundry,detergent',14.90),
  ('agua-sanitaria-2l','Água sanitária','Limpeza','Frasco 2 litros','Água sanitária para limpeza e desinfecção.','Frasco de água sanitária de dois litros.','🧴','bleach,cleaning',7.49),
  ('desinfetante-2l','Desinfetante lavanda','Limpeza','Frasco 2 litros','Desinfetante perfumado de lavanda.','Frasco de desinfetante de dois litros.','🌿','cleaning,spray',9.90),
  ('esponja-multiuso-4','Esponja multiuso','Limpeza','Pacote 4 unidades','Esponja dupla face multiuso.','Pacote com quatro esponjas multiuso.','🧽','sponge,cleaning',5.49),
  -- Higiene
  ('sabonete-90g','Sabonete hidratante','Higiene','Unidade 90 g','Sabonete em barra hidratante.','Sabonete de noventa gramas.','🧼','soap,bar',2.99),
  ('shampoo-350ml','Shampoo hidratante','Higiene','Frasco 350 ml','Shampoo hidratante para uso diário.','Frasco de shampoo de trezentos e cinquenta mililitros.','🧴','shampoo,bottle',16.90),
  ('creme-dental-90g','Creme dental','Higiene','Tubo 90 g','Creme dental com flúor.','Tubo de creme dental de noventa gramas.','🦷','toothpaste,dental',5.79),
  ('desodorante-150ml','Desodorante aerossol','Higiene','Frasco 150 ml','Desodorante aerossol 48 horas de proteção.','Frasco de desodorante de cento e cinquenta mililitros.','💨','deodorant,spray',15.90),
  -- Bebê e Pet
  ('fralda-m-30','Fralda descartável tamanho M','Bebê','Pacote 30 unidades','Fralda descartável com camada extra seca.','Pacote com trinta fraldas tamanho M.','🍼','diapers,baby',49.90),
  ('racao-caes-10kg','Ração para cães adultos','Pet','Pacote 10 kg','Ração seca completa para cães adultos.','Pacote de ração para cães de dez quilos.','🐶','dog,food',89.90),
  ('areia-gato-4kg','Areia sanitária para gatos','Pet','Pacote 4 kg','Areia sanitária higiênica para gatos.','Pacote de areia sanitária de quatro quilos.','🐱','cat,litter',19.90)
), ins AS (
  INSERT INTO public.products (id, name, category, unit, description, audio_description, image_emoji, image_url)
  SELECT s.id, s.name, s.category, s.unit, s.description, s.audio_description, s.image_emoji,
         'https://loremflickr.com/600/600/' || s.kw || '?lock=' || abs(hashtext(s.id)) % 9000
  FROM seed s
  ON CONFLICT (id) DO NOTHING
  RETURNING id
)
INSERT INTO public.product_stocks (product_id, store_id, price, stock)
SELECT s.id, st.store_id,
       round((s.base_price * st.mult)::numeric, 2),
       10 + (abs(hashtext(s.id || st.store_id)) % 90)
FROM seed s
CROSS JOIN (VALUES
  ('bom-preco-centro', 1.00),
  ('super-vale-jardim', 1.06),
  ('mega-hiper-norte', 0.96),
  ('atacadao-uniao', 0.88),
  ('mercado-da-vila', 1.09)
) AS st(store_id, mult)
WHERE s.id IN (SELECT id FROM ins)
  AND abs(hashtext(s.id || st.store_id)) % 10 < 8
ON CONFLICT (product_id, store_id) DO NOTHING;

UPDATE public.products SET image_url = v.url FROM (VALUES
  ('arroz-branco-5kg','https://loremflickr.com/600/600/rice,bag?lock=11'),
  ('feijao-carioca-1kg','https://loremflickr.com/600/600/beans,legume?lock=12'),
  ('acucar-refinado-1kg','https://loremflickr.com/600/600/sugar,bowl?lock=13'),
  ('cafe-torrado-500g','https://loremflickr.com/600/600/coffee,beans?lock=14'),
  ('oleo-soja-900ml','https://loremflickr.com/600/600/cooking,oil?lock=15'),
  ('leite-integral-1l','https://loremflickr.com/600/600/milk,carton?lock=16'),
  ('banana-prata-kg','https://loremflickr.com/600/600/banana,fruit?lock=17'),
  ('tomate-kg','https://loremflickr.com/600/600/tomato,vegetable?lock=18'),
  ('peito-frango-kg','https://loremflickr.com/600/600/chicken,breast?lock=19'),
  ('paozinho-kg','https://loremflickr.com/600/600/baguette,bread?lock=20'),
  ('detergente-500ml','https://loremflickr.com/600/600/dish,soap?lock=21'),
  ('papel-higienico-12','https://loremflickr.com/600/600/toilet,paper?lock=22')
) AS v(id, url)
WHERE public.products.id = v.id;