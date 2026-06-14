import {
  BellRing,
  Gift,
  Megaphone,
  PackageCheck,
  Sparkles,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import type { NotificationType } from "@/types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatters";

const filterLabels: Record<NotificationType | "all", string> = {
  all: "Todas",
  promotion: "Promoções",
  product_available: "Produto disponível",
  vote_result: "Resultado de votação",
  news: "Novidades",
  announcement: "Comunicados",
};

const typeIcon: Record<NotificationType, ReactNode> = {
  promotion: <Gift className="h-4 w-4" />,
  product_available: <PackageCheck className="h-4 w-4" />,
  vote_result: <Trophy className="h-4 w-4" />,
  news: <Sparkles className="h-4 w-4" />,
  announcement: <Megaphone className="h-4 w-4" />,
};

export function NotificationCenter({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const notifications = useAppStore((state) => state.notifications);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore((state) => state.markAllNotificationsRead);
  const deleteNotification = useAppStore((state) => state.deleteNotification);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const filteredNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => filter === "all" || notification.type === filter,
      ),
    [filter, notifications],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/40" onClick={onClose}>
      <aside
        className={cn(
          "fixed inset-x-0 bottom-0 max-h-[86vh] overflow-hidden rounded-t-3xl border bg-card shadow-2xl",
          "md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-[420px] md:rounded-none",
        )}
        onClick={(event) => event.stopPropagation()}
        aria-label="Central de notificações"
      >
        <header className="flex items-start justify-between gap-3 border-b p-4">
          <div>
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Notificações</h2>
              {unreadCount ? <Badge>{unreadCount} novas</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Promoções, novidades e comunicados da doceria.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex items-center gap-2 border-b p-4">
          <Select
            aria-label="Filtrar notificações"
            value={filter}
            onChange={(event) => setFilter(event.target.value as NotificationType | "all")}
          >
            {Object.entries(filterLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Button variant="outline" onClick={markAllNotificationsRead}>
            Ler todas
          </Button>
        </div>

        <div className="max-h-[calc(86vh-160px)] space-y-3 overflow-y-auto p-4 md:max-h-[calc(100vh-160px)]">
          {filteredNotifications.map((notification) => (
            <article
              key={notification.id}
              className={cn(
                "rounded-2xl border p-4 transition",
                notification.read ? "bg-card" : "bg-secondary/60",
              )}
            >
              <div className="flex gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  {typeIcon[notification.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="secondary">{filterLabels[notification.type]}</Badge>
                      <h3 className="mt-2 font-semibold">{notification.title}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Excluir notificação"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </span>
                    {!notification.read ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        Marcar como lida
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
