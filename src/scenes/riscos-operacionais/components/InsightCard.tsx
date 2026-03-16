import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightCardProps {
  title: string;
  items: string[];
  icon: React.ElementType;
  toneClass: string;
}

export function InsightCard({ title, items, icon: Icon, toneClass }: InsightCardProps) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={`${title}-${index}`} className={`rounded-xl border px-4 py-3 text-sm ${toneClass}`}>
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

