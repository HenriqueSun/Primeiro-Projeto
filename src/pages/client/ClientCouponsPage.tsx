import { Copy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store/appStore";
import { formatDate } from "@/utils/formatters";

export function ClientCouponsPage() {
  const coupons = useAppStore((state) => state.coupons);

  return (
    <div>
      <PageHeader
        title="Cupons Promocionais"
        description="Cupons disponíveis para aplicar futuramente em encomendas."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {coupons.map((coupon) => (
          <Card key={coupon.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <Badge variant={coupon.status === "active" ? "success" : "secondary"}>
                    {coupon.status === "active" ? "Disponível" : coupon.status}
                  </Badge>
                  <h2 className="mt-3 text-xl font-bold">{coupon.title}</h2>
                </div>
                <div className="rounded-2xl bg-secondary px-3 py-2 text-lg font-black text-primary">
                  {coupon.discount}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{coupon.description}</p>
              <div className="mt-5 rounded-xl border border-dashed bg-secondary/50 p-4 text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Código</p>
                <p className="mt-1 text-2xl font-black tracking-wider text-primary">
                  {coupon.code}
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Válido até {formatDate(coupon.validUntil)}
              </p>
              <Button
                className="mt-4 min-h-11 w-full"
                onClick={async () => {
                  await navigator.clipboard?.writeText(coupon.code);
                  toast.success("Cupom copiado.");
                }}
              >
                <Copy className="h-4 w-4" />
                Copiar cupom
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
