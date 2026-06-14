import {
  BadgePercent,
  ClipboardList,
  HeartHandshake,
  Home,
  Heart,
  MenuSquare,
  Trophy,
  Settings,
} from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";

const navItems = [
  { label: "Página Inicial", href: "/cliente", icon: <Home className="h-5 w-5" /> },
  {
    label: "Votação de Produtos",
    href: "/cliente/votacao",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Feedbacks",
    href: "/cliente/feedbacks",
    icon: <HeartHandshake className="h-5 w-5" />,
  },
  {
    label: "Cardápio Completo",
    href: "/cliente/cardapio",
    icon: <MenuSquare className="h-5 w-5" />,
  },
  {
    label: "Favoritos",
    href: "/cliente/favoritos",
    icon: <Heart className="h-5 w-5" />,
  },
  {
    label: "Fidelidade",
    href: "/cliente/fidelidade",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    label: "Cupons",
    href: "/cliente/cupons",
    icon: <BadgePercent className="h-5 w-5" />,
  },
  {
    label: "Perfil e Configurações",
    href: "/cliente/perfil",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function ClientLayout() {
  return <AppLayout area="cliente" navItems={navItems} />;
}
