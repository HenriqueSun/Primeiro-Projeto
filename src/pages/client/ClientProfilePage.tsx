import { Camera, Save, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import { formatBrazilianPhone } from "@/utils/auth";
import { getInitials } from "@/utils/formatters";

export function ClientProfilePage() {
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [name, setName] = useState(user?.fullName ?? user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? user?.avatarUrl ?? "");
  const [theme, setTheme] = useState(user?.preferences.theme ?? "light");
  const [notifications, setNotifications] = useState(
    user?.preferences.notifications ?? true,
  );

  const save = () => {
    if (!user) return;
    updateProfile({
      ...user,
      fullName: name,
      name,
      phone,
      avatar,
      avatarUrl: avatar,
      preferences: {
        theme,
        notifications,
      },
    });
    toast.success("Perfil atualizado.");
  };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <PageHeader
        title="Perfil e Configurações"
        description="Atualize seus dados, preferências e configurações de conta."
        action={
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-secondary text-3xl font-black text-primary">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(name || "Cliente")
              )}
            </div>
            <h2 className="mt-4 text-xl font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-5 grid gap-2">
              <Button variant="outline" className="w-full" asChild>
                <label>
                  <Camera className="h-4 w-4" />
                  Alterar foto
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </Button>
              {avatar ? (
                <Button variant="ghost" className="w-full" onClick={() => setAvatar("")}>
                  <Trash2 className="h-4 w-4" />
                  Remover foto
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Dados pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(formatBrazilianPhone(event.target.value))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Nova senha" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <Select
                  id="theme"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as "light" | "dark")}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </Select>
              </div>
              <label className="flex items-center gap-3 rounded-xl border p-4">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(event) => setNotifications(event.target.checked)}
                />
                <span>
                  <strong className="block">Notificações</strong>
                  <span className="text-sm text-muted-foreground">
                    Receber novidades e avisos da doceria.
                  </span>
                </span>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
