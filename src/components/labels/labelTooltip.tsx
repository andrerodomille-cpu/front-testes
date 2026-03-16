import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"

const LabelTooltip = ({
  label,
  tooltip,
  htmlFor,
  color,
}: {
  label: string
  tooltip?: string
  htmlFor: string
  color: string
}) => (
  <div className="flex items-center gap-1">
    <Label htmlFor={htmlFor} style={{ color }} className="text-xs pl-1">
      {label}
    </Label>
    {tooltip && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
)
