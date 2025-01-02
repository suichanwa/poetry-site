import { Crown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function PremiumBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Crown className="w-4 h-4 text-yellow-500 inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Premium Member</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}