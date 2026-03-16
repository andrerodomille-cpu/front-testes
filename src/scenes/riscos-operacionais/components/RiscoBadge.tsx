
import { Badge } from "@/components/ui/badge";
import { toneClasses } from "../utils";
import { SeveridadeRisco } from "../types";

interface RiscoBadgeProps {
  label: string;
  tone: SeveridadeRisco;
}

export function RiscoBadge({ label, tone }: RiscoBadgeProps) {
  return (
    <Badge variant="outline" className={toneClasses[tone]}>
      {label}
    </Badge>
  );
}
