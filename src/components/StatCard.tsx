import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  title,
  value,
  icon,
  helper,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  helper?: string;
}) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 font-serif text-3xl font-semibold tracking-tight">{value}</p>
          {helper ? <p className="mt-1.5 text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary ring-1 ring-inset ring-accent/30">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
