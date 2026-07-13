import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronLeft,
  LogOut,
  Menu,
  Search,
  Sparkles,
  UserCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Input } from "@/components/ui/form";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { NotificationCenter } from "@/components/NotificationCenter";
import { SocialLinks } from "@/components/SocialLinks";
import { useAuth } from "@/contexts/AuthProvider";
import { useNotifications } from "@/hooks/useNotifications";
import { emptySettings, useSettings } from "@/hooks/useSettings";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/formatters";

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type AppLayoutProps = {
  area: "cliente" | "admin";
  navItems: NavItem[];
};

export function AppLayout({ area, navItems }: AppLayoutProps) {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout: signOut } = useAuth();
  const { data: settings = emptySettings } = useSettings();
  const { data: notifications = [] } = useNotifications(user?.id, user?.role === "admin");
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const logout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-card/95 backdrop-blur lg:block",
          sidebarOpen ? "w-72" : "w-20",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between px-4">
            <Brand compact={!sidebarOpen} name={settings.bakeryName} />
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronLeft
                className={cn("h-5 w-5 transition", !sidebarOpen && "rotate-180")}
              />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === `/${area}`}
                className={({ isActive }) =>
                  cn(
                    "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    !sidebarOpen && "justify-center px-0",
                  )
                }
              >
                {item.icon}
                {sidebarOpen ? <span>{item.label}</span> : null}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 border-t p-3">
            {sidebarOpen ? <SocialLinks /> : <SocialLinks compact />}
            <Button
              variant="ghost"
              className={cn("w-full", !sidebarOpen && "px-0")}
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen ? "Sair" : null}
            </Button>
          </div>
        </div>
      </aside>

      <div className={cn("transition-[padding]", sidebarOpen ? "lg:pl-72" : "lg:pl-20")}>
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border bg-card px-3 md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Busca global"
                className="border-0 bg-transparent px-0 shadow-none focus:ring-0"
                placeholder="Buscar produtos, votações, feedbacks..."
              />
            </div>

            <Button variant="outline" className="hidden sm:inline-flex">
              <Sparkles className="h-4 w-4" />
              {area === "admin" ? "Painel Admin" : "Área Cliente"}
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir notificações"
                onClick={() => setNotificationOpen(true)}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {unreadCount ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-3 rounded-full border bg-card px-3 py-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-sm font-bold text-primary">
                {user ? getInitials(user.name) : <UserCircle className="h-5 w-5" />}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {sidebarOpen ? (
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            >
              <motion.aside
                className="h-full w-80 max-w-[86vw] bg-card p-4"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-6 flex items-center justify-between">
                  <Brand name={settings.bakeryName} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === `/${area}`}
                      className={({ isActive }) =>
                        cn(
                          "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-secondary",
                        )
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-6 border-t pt-4">
                  <p className="mb-3 text-sm font-semibold">Redes sociais</p>
                  <SocialLinks />
                </div>
              </motion.aside>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className={cn("px-4 py-6 sm:px-6 lg:px-8", area === "cliente" && "pb-28 lg:pb-8")}>
          <Outlet />
        </main>
      </div>
      <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />
      <FloatingWhatsApp />
      {area === "cliente" ? <MobileBottomNav /> : null}
    </div>
  );
}

function Brand({ name, compact = false }: { name: string; compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-sm">
        DL
      </div>
      {!compact ? (
        <div className="min-w-0">
          <p className="truncate font-bold text-primary">{name}</p>
          <Badge variant="secondary">Gestão de Doceria</Badge>
        </div>
      ) : null}
    </div>
  );
}
