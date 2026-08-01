import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/session";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export default function AuthButton() {
  const { user, isLoading, signOut } = useSession();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da sua conta.");
    navigate({ to: "/" });
  };

  if (isLoading) {
    return <div className="h-9 w-9 rounded-full bg-muted" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/auth">Entrar</Link>
      </Button>
    );
  }

  const email = user.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();
  const avatarUrl = user.user_metadata?.["avatar_url"] as string | undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={`Conta de ${email}`}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt="" />
            <AvatarFallback>
              {initials || <UserIcon className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[220px] truncate text-xs text-muted-foreground">
          {email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
