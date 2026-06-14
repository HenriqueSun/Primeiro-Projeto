import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import { formatDate } from "@/utils/formatters";

export function AdminNoticesPage() {
  const notifications = useAppStore((state) => state.notifications);
  const addNotification = useAppStore((state) => state.addNotification);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    message: "",
    publishDate: new Date().toISOString().slice(0, 10),
    expireDate: "",
  });

  const publish = () => {
    if (!form.title || !form.message) {
      toast.error("Informe título e mensagem.");
      return;
    }

    addNotification({
      id: crypto.randomUUID(),
      type: "announcement",
      title: form.title,
      message: form.expireDate
        ? `${form.message} Expira em ${formatDate(form.expireDate)}.`
        : form.message,
      read: false,
      createdAt: form.publishDate,
    });
    setOpen(false);
    setForm({
      title: "",
      message: "",
      publishDate: new Date().toISOString().slice(0, 10),
      expireDate: "",
    });
    toast.success("Aviso publicado.");
  };

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Avisos"
        description="Publique comunicados, promoções e eventos para os clientes."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Publicar aviso
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader>
              <CardTitle>{notification.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Publicado em {formatDate(notification.createdAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        title="Publicar aviso"
        confirmLabel="Publicar"
        onClose={() => setOpen(false)}
        onConfirm={publish}
      >
        <div className="space-y-4">
          <Field label="Título">
            <Input
              value={form.title}
              onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
            />
          </Field>
          <Field label="Mensagem">
            <Textarea
              value={form.message}
              onChange={(event) =>
                setForm((state) => ({ ...state, message: event.target.value }))
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data de publicação">
              <Input
                type="date"
                value={form.publishDate}
                onChange={(event) =>
                  setForm((state) => ({ ...state, publishDate: event.target.value }))
                }
              />
            </Field>
            <Field label="Data de expiração">
              <Input
                type="date"
                value={form.expireDate}
                onChange={(event) =>
                  setForm((state) => ({ ...state, expireDate: event.target.value }))
                }
              />
            </Field>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
