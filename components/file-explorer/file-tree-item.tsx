"use client";

import type { ExplorerItem } from "@/types/explorer";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileIcon } from "./file-icon";
import { useExplorer } from "./explorer-context";

export function FileTreeItem({
  file,
  depth,
}: {
  file: ExplorerItem;
  depth: number;
}) {
  const { setPreviewItem, previewItem, navigateTo } = useExplorer();
  const isSelected = previewItem?.key === file.key;

  const handleClick = () => {
    navigateTo(file.parentPath);
    setPreviewItem(file);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-md px-1 py-1 text-sm cursor-pointer hover:bg-accent",
            isSelected && "bg-accent font-medium"
          )}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          onClick={handleClick}
        >
          <span className="h-5 w-5 shrink-0" aria-hidden="true" />
          <FileIcon name={file.name} type="file" className="h-3.5 w-3.5" />
          <span className="truncate flex-1 min-w-0 text-muted-foreground">
            {file.name}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">{file.key}</TooltipContent>
    </Tooltip>
  );
}
