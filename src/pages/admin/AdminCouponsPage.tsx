import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { useAppStore } from "@/store/appStore";
import type { Coupon, CouponStatus } from "@/types";
import { formatDate } from "@/utils/formatters";

const emptyCoupon = {
  code: "",
  title: "",
  description: "",
  discount: "",
  validUntil: "",
  status: "active" as CouponStatus,
};

export function AdminCouponsPage() {
  const coupons = useAppStore((state) => state.coupons);
  const addCoupon = useAppStore((state) => state.addCoupon);
  const updateCoupon = useAppStore((state) => state.updateCoupon);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyCoupon);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyCoupon);
    setOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm(coupon);
    setOpen(true);
  };

  const save = () => {
    if (!form.code || !form.title || !form.discount || !form.validUntil) {
      toast.error("Preencha código, título, desconto e validade.");
      return;
    }

    const coupon: Coupon = {
      id: editing?.id ?? crypto.randomUUID(),
      ...form,
    };

    if (editing) {
      updateCoupon(coupon);
      toast.success("Cupom atualizado.");
    } else {
      addCoupon(coupon);
      toast.success("Cupom criado.");
    }

    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Cupons Promocionais"
        description="Crie e mantenha cupons para campanhas futuras de marketing."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Criar cupom
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {coupons.map((coupon) => (
          <Card key={coupon.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant={coupon.status === "active" ? "success" : "secondary"}>
                    {coupon.status}
                  </Badge>
                  <h2 className="mt-3 text-xl font-bold">{coupon.title}</h2>
                  <p className="text-sm text-muted-foreground">{coupon.description}</p>
                </div>
                <div className="rounded-2xl bg-secondary px-4 py-3 text-xl font-black text-primary">
                  {coupon.discount}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-xl border bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <strong className="tracking-wider text-primary">{coupon.code}</strong>
                <span className="text-sm text-muted-foreground">
                  Até {formatDate(coupon.validUntil)}
                </span>
              </div>
              <Button variant="outline" className="w-full" onClick={() => openEdit(coupon)}>
                Editar cupom
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        title={editing ? "Editar cupom" : "Criar cupom"}
        confirmLabel="Salvar"
        onClose={() => setOpen(false)}
        onConfirm={save}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Código">
            <Input value={form.code} onChange={(event) => setForm((state) => ({ ...state, code: event.target.value.toUpperCase() }))} />
          </Field>
          <Field label="Desconto">
            <Input value={form.discount} placeholder="10%" onChange={(event) => setForm((state) => ({ ...state, discount: event.target.value }))} />
          </Field>
          <Field label="Título">
            <Input value={form.title} onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))} />
          </Field>
          <Field label="Validade">
            <Input type="date" value={form.validUntil} onChange={(event) => setForm((state) => ({ ...state, validUntil: event.target.value }))} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(event) => setForm((state) => ({ ...state, status: event.target.value as CouponStatus }))}>
              <option value="active">Ativo</option>
              <option value="scheduled">Agendado</option>
              <option value="expired">Expirado</option>
            </Select>
          </Field>
          <div className="space-y-2 sm:col-span-2">
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))} />
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
