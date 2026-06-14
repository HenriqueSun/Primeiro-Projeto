import {
  BadgePercent,
  BellRing,
  CalendarDays,
  Gift,
  Home,
  MessageSquareText,
  Package,
  Settings,
  Star,
  UsersRound,
  Vote,
} from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <Home className="h-5 w-5" /> },
  {
    label: "Usuários",
    href: "/admin/usuarios",
    icon: <UsersRound className="h-5 w-5" />,
  },
  {
    label: "Produtos",
    href: "/admin/produtos",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Votações",
    href: "/admin/votacoes",
    icon: <Vote className="h-5 w-5" />,
  },
  {
    label: "Promoções",
    href: "/admin/promocoes",
    icon: <Gift className="h-5 w-5" />,
  },
  {
    label: "Cupons",
    href: "/admin/cupons",
    icon: <BadgePercent className="h-5 w-5" />,
  },
  {
    label: "Produtos do Dia",
    href: "/admin/produtos-dia",
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    label: "Produtos da Semana",
    href: "/admin/produtos-semana",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Feedbacks",
    href: "/admin/feedbacks",
    icon: <MessageSquareText className="h-5 w-5" />,
  },
  {
    label: "Avisos",
    href: "/admin/avisos",
    icon: <BellRing className="h-5 w-5" />,
  },
  {
    label: "Configurações",
    href: "/admin/configuracoes",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminLayout() {
  return <AppLayout area="admin" navItems={navItems} />;
}
