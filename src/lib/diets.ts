import type { DietTag } from "@/lib/types";

export interface DietTagMeta {
  id: DietTag;
  label: string;
  /** Classe do "chip"/badge quando o filtro está ativo. */
  activeClassName: string;
  /** Classe do badge exibido no produto. */
  badgeClassName: string;
}

export const DIET_TAGS: DietTagMeta[] = [
  {
    id: "vegano",
    label: "Vegano",
    activeClassName: "bg-diet-vegan text-diet-vegan-foreground hover:bg-diet-vegan/90",
    badgeClassName: "bg-diet-vegan text-diet-vegan-foreground",
  },
  {
    id: "zero-acucar",
    label: "Zero Açúcar",
    activeClassName: "bg-diet-sugarfree text-diet-sugarfree-foreground hover:bg-diet-sugarfree/90",
    badgeClassName: "bg-diet-sugarfree text-diet-sugarfree-foreground",
  },
  {
    id: "sem-gluten",
    label: "Sem Glúten",
    activeClassName:
      "bg-diet-glutenfree text-diet-glutenfree-foreground hover:bg-diet-glutenfree/90",
    badgeClassName: "bg-diet-glutenfree text-diet-glutenfree-foreground",
  },
  {
    id: "sem-lactose",
    label: "Sem Lactose",
    activeClassName:
      "bg-diet-lactosefree text-diet-lactosefree-foreground hover:bg-diet-lactosefree/90",
    badgeClassName: "bg-diet-lactosefree text-diet-lactosefree-foreground",
  },
];

export const DIET_TAG_MAP: Record<string, DietTagMeta> = Object.fromEntries(
  DIET_TAGS.map((tag) => [tag.id, tag]),
);
