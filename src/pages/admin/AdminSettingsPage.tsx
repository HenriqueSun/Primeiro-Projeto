import { Save } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";

export function AdminSettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const [form, setForm] = useState({
    ...settings,
    facebookUrl: settings.facebookUrl ?? "",
    tiktokUrl: settings.tiktokUrl ?? "",
    customLinks: settings.customLinks ?? [],
  });

  const save = () => {
    updateSettings(form);
    toast.success("Configurações atualizadas.");
  };

  return (
    <div>
      <PageHeader
        title="Configurações Administrativas"
        description="Gerencie dados da doceria, redes sociais, horários e informações institucionais."
        action={
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        }
      />

      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Dados da doceria</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da doceria">
              <Input
                value={form.bakeryName}
                onChange={(event) =>
                  setForm((state) => ({ ...state, bakeryName: event.target.value }))
                }
              />
            </Field>
            <Field label="Logo">
              <Input
                value={form.logoUrl ?? ""}
                onChange={(event) =>
                  setForm((state) => ({ ...state, logoUrl: event.target.value }))
                }
              />
            </Field>
            <Field label="Telefone">
              <Input
                value={form.phone}
                onChange={(event) =>
                  setForm((state) => ({ ...state, phone: event.target.value }))
                }
              />
            </Field>
            <Field label="Horário de funcionamento">
              <Input
                value={form.openingHours}
                onChange={(event) =>
                  setForm((state) => ({ ...state, openingHours: event.target.value }))
                }
              />
            </Field>
            <Field label="Endereço">
              <Input
                value={form.address}
                onChange={(event) =>
                  setForm((state) => ({ ...state, address: event.target.value }))
                }
              />
            </Field>
            <Field label="Instagram">
              <Input
                value={form.instagramUrl}
                onChange={(event) =>
                  setForm((state) => ({ ...state, instagramUrl: event.target.value }))
                }
              />
            </Field>
            <Field label="WhatsApp">
              <Input
                value={form.whatsappUrl}
                onChange={(event) =>
                  setForm((state) => ({ ...state, whatsappUrl: event.target.value }))
                }
              />
            </Field>
            <Field label="Facebook">
              <Input
                value={form.facebookUrl ?? ""}
                onChange={(event) =>
                  setForm((state) => ({ ...state, facebookUrl: event.target.value }))
                }
              />
            </Field>
            <Field label="TikTok">
              <Input
                value={form.tiktokUrl ?? ""}
                onChange={(event) =>
                  setForm((state) => ({ ...state, tiktokUrl: event.target.value }))
                }
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links personalizados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(form.customLinks ?? []).map((link, index) => (
              <div key={`${link.label}-${index}`} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                <Input
                  aria-label="Nome do link"
                  value={link.label}
                  onChange={(event) =>
                    setForm((state) => ({
                      ...state,
                      customLinks: state.customLinks.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, label: event.target.value } : item,
                      ),
                    }))
                  }
                />
                <Input
                  aria-label="URL do link"
                  value={link.url}
                  onChange={(event) =>
                    setForm((state) => ({
                      ...state,
                      customLinks: state.customLinks.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, url: event.target.value } : item,
                      ),
                    }))
                  }
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    setForm((state) => ({
                      ...state,
                      customLinks: state.customLinks.filter((_, itemIndex) => itemIndex !== index),
                    }))
                  }
                >
                  Remover
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() =>
                setForm((state) => ({
                  ...state,
                  customLinks: [...(state.customLinks ?? []), { label: "Novo link", url: "https://" }],
                }))
              }
            >
              Adicionar link
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banner principal e institucional</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Título do banner">
              <Input
                value={form.heroBanner.title}
                onChange={(event) =>
                  setForm((state) => ({
                    ...state,
                    heroBanner: { ...state.heroBanner, title: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="CTA">
              <Input
                value={form.heroBanner.ctaLabel}
                onChange={(event) =>
                  setForm((state) => ({
                    ...state,
                    heroBanner: { ...state.heroBanner, ctaLabel: event.target.value },
                  }))
                }
              />
            </Field>
            <div className="space-y-2 sm:col-span-2">
              <Label>Subtítulo do banner</Label>
              <Textarea
                value={form.heroBanner.subtitle}
                onChange={(event) =>
                  setForm((state) => ({
                    ...state,
                    heroBanner: { ...state.heroBanner, subtitle: event.target.value },
                  }))
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Informações institucionais</Label>
              <Textarea
                value={form.institutionalText}
                onChange={(event) =>
                  setForm((state) => ({ ...state, institutionalText: event.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
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
