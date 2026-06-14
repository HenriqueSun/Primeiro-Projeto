import { Heart, Home, MenuSquare, Trophy, UserCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

const items = [
  { label: "Início", href: "/cliente", icon: <Home className="h-5 w-5" /> },
  { label: "Cardápio", href: "/cliente/cardapio", icon: <MenuSquare className="h-5 w-5" /> },
  { label: "Votações", href: "/cliente/votacao", icon: <Trophy className="h-5 w-5" /> },
  { label: "Favoritos", href: "/cliente/favoritos", icon: <Heart className="h-5 w-5" /> },
  { label: "Perfil", href: "/cliente/perfil", icon: <UserCircle className="h-5 w-5" /> },
];

export function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-border bg-card/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-elevated backdrop-blur-xl lg:hidden"
      aria-label="Navegação principal mobile"
    >
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/cliente"}
          className={({ isActive }) =>
            cn(
              "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium text-muted-foreground transition-all duration-200",
              isActive && "bg-secondary font-semibold text-primary",
            )
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
