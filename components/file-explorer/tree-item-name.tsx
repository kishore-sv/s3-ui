"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TreeItemName({
  name,
  title,
  className,
}: {
  name: string;
  title?: string;
  className?: string;
}) {
  const fullTitle = title ?? name;

  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "block truncate flex-1 min-w-0 text-left",
            className
          )}
        >
          {name}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-sm break-all">
        {fullTitle}
      </TooltipContent>
    </Tooltip>
  );
}
