import { Button } from "@/components/ui/button";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname === "/") return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1"
      aria-label="Voltar para a página anterior"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.history.back();
        } else {
          router.navigate({ to: "/" });
        }
      }}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Voltar
    </Button>
  );
}