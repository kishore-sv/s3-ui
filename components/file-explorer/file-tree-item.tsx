"use client";

import type { ExplorerItem } from "@/types/explorer";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileIcon } from "./file-icon";
import { TreeItemName } from "./tree-item-name";
import { FileActionMenu } from "./file-actions";
import { useExplorer } from "./explorer-context";

export function FileTreeItem({
  file,
  depth,
  onDeleteItem,
}: {
  file: ExplorerItem;
  depth: number;
  onDeleteItem: (item: ExplorerItem) => void;
}) {
  const { setPreviewItem, previewItem, navigateTo } = useExplorer();
  const isSelected = previewItem?.key === file.key;

  const handleClick = () => {
    navigateTo(file.parentPath);
    setPreviewItem(file);
  };

  return (
    <div
      className={cn(
        "group flex w-full min-w-0 items-center gap-0.5 overflow-hidden rounded-md px-1 py-1 text-sm cursor-pointer hover:bg-accent",
        isSelected && "bg-accent font-medium"
      )}
      style={{ paddingLeft: `${depth * 12 + 4}px` }}
      onClick={handleClick}
    >
      <span className="h-5 w-5 shrink-0" aria-hidden="true" />
      <FileIcon
        name={file.name}
        type="file"
        className="h-3.5 w-3.5 shrink-0"
      />
      <TreeItemName
        name={file.name}
        title={file.key}
        className="text-muted-foreground"
      />
      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
        <FileActionMenu
          item={file}
          onDelete={onDeleteItem}
          trigger={
            <button
              type="button"
              className="flex h-5 w-5 items-center justify-center rounded-md hover:bg-muted"
              aria-label={`Actions for ${file.name}`}
            >
              <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
            </button>
          }
        />
      </div>
    </div>
  );
}
