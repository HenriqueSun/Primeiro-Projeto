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
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
