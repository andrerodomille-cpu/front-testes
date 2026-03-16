import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
}

export function KPICard({ title, value, subtitle, icon: Icon }: KPICardProps) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/50 p-3">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
