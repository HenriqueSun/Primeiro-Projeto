import { Gift, Star, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/appStore";
import { formatDate } from "@/utils/formatters";

export function ClientLoyaltyPage() {
  const loyalty = useAppStore((state) => state.loyaltyAccount);
  const progress = Math.min(
    Math.round((loyalty.points / loyalty.nextReward.requiredPoints) * 100),
    100,
  );

  return (
    <div>
      <PageHeader
        title="Programa de Fidelidade"
        description="Acumule pontos em cada compra simulada: R$ 1 = 1 ponto."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard title="Pontos acumulados" value={loyalty.points} icon={<Trophy />} />
        <StatCard
          title="Próxima recompensa"
          value={loyalty.nextReward.title}
          icon={<Gift />}
          helper={`${loyalty.nextReward.requiredPoints - loyalty.points} pontos restantes`}
        />
        <StatCard title="Progresso" value={`${progress}%`} icon={<Star />} />
      </div>

      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">{loyalty.nextReward.title}</p>
            <Badge>{progress}%</Badge>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Benefícios</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {loyalty.benefits.map((benefit) => (
              <div key={benefit} className="rounded-xl border bg-card p-4 font-medium">
                {benefit}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loyalty.history.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</p>
                </div>
                <Badge variant="success">+{item.points}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
