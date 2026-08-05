import type { Catalog } from "@/lib/catalog";
import { effectivePrice, formatPrice } from "@/lib/format";
import type { Product, Store } from "@/lib/types";

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "tem","teem","tem?","o","a","os","as","um","uma","de","do","da","dos","das","no","na","nos","nas",
  "em","para","pra","por","com","quero","queria","buscar","busca","procurar","procura","achar",
  "me","mostre","mostra","ver","voce","vc","existe","disponivel","disponivel?","preco","preco?",
  "quanto","custa","qual","e","eh","ai","la","algum","alguma","produto","produtos","mercado",
  "supermercado","loja","hipermercado","atacadista","estoque","comprar","gostaria","favor",
]);

function tokens(text: string) {
  return normalize(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function scoreMatch(candidate: string, words: string[]) {
  const target = normalize(candidate);
  let score = 0;
  for (const word of words) {
    if (target.includes(word)) score += word.length;
  }
  return score;
}

export interface VoiceSearchResult {
  transcript: string;
  product: Product | null;
  store: Store | null;
  term: string;
  message: string;
  navigate: { to: "/buscar"; search: { q: string } } | { to: "/loja/$id"; params: { id: string }; search: { q: string } };
}

export function resolveVoiceQuery(transcript: string, catalog: Catalog): VoiceSearchResult {
  const words = tokens(transcript);

  let store: Store | null = null;
  let storeScore = 0;
  for (const candidate of catalog.stores) {
    const score = Math.max(
      scoreMatch(candidate.name, words),
      scoreMatch(candidate.network, words),
    );
    if (score > storeScore) {
      storeScore = score;
      store = candidate;
    }
  }

  const storeWords = store ? new Set(tokens(`${store.name} ${store.network}`)) : new Set<string>();
  const productWords = words.filter((word) => !storeWords.has(word));

  let product: Product | null = null;
  let productScore = 0;
  for (const candidate of catalog.products) {
    const score = Math.max(
      scoreMatch(candidate.name, productWords),
      scoreMatch(candidate.category, productWords) / 2,
    );
    if (score > productScore) {
      productScore = score;
      product = candidate;
    }
  }
  if (productScore < 3) product = null;

  const term = product ? product.name : productWords.join(" ");

  if (store && product) {
    const stock = product.stocks.find((item) => item.storeId === store!.id);
    const message =
      stock && stock.stock > 0
        ? `Sim. ${product.name} está disponível no ${store.name} por ${formatPrice(
            effectivePrice(stock),
          )}, com ${stock.stock} em estoque.`
        : `${product.name} não está disponível no ${store.name} no momento.`;
    return {
      transcript,
      product,
      store,
      term,
      message,
      navigate: { to: "/loja/$id", params: { id: store.id }, search: { q: product.name } },
    };
  }

  if (store) {
    return {
      transcript,
      product: null,
      store,
      term,
      message: `Mostrando os produtos do ${store.name}.`,
      navigate: { to: "/loja/$id", params: { id: store.id }, search: { q: term } },
    };
  }

  if (product) {
    const best = product.stocks[0];
    const message = best
      ? `${product.name} encontrado a partir de ${formatPrice(effectivePrice(best))}.`
      : `${product.name} encontrado.`;
    return {
      transcript,
      product,
      store: null,
      term,
      message,
      navigate: { to: "/buscar", search: { q: product.name } },
    };
  }

  const fallback = productWords.join(" ") || normalize(transcript);
  return {
    transcript,
    product: null,
    store: null,
    term: fallback,
    message: fallback
      ? `Buscando por ${fallback}.`
      : "Não entendi o produto. Tente dizer, por exemplo: tem arroz no Sonda?",
    navigate: { to: "/buscar", search: { q: fallback } },
  };
}
