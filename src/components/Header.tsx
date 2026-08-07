import AuthButton from "@/components/AuthButton";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/const";
import { useCart } from "@/lib/cart";
import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/buscar", label: "Buscar Produtos" },
  { to: "/lojas", label: "Lojas" },
] as const;

export default function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-1">
          <BackButton />
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold"
            aria-label={`${APP_NAME} — página inicial`}
          >
            <img src="/favicon.png" alt="Conecta Mercado" className="h-9 w-9" />
            <span className="hidden text-lg sm:inline">{APP_NAME}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.to}
              asChild
              variant={pathname === link.to ? "secondary" : "ghost"}
              size="sm"
            >
              <Link to={link.to}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" className="relative">
            <Link to="/carrinho" aria-label={`Carrinho, ${totalItems} itens`}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center px-1">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>
          <AuthButton />
        </div>
      </div>

      <nav
        className="flex items-center gap-1 overflow-x-auto border-t px-4 py-2 sm:hidden"
        aria-label="Navegação principal (mobile)"
      >
        {NAV_LINKS.map((link) => (
          <Button
            key={link.to}
            asChild
            variant={pathname === link.to ? "secondary" : "ghost"}
            size="sm"
          >
            <Link to={link.to}>{link.label}</Link>
          </Button>
        ))}
      </nav>
    </header>
  );
}
