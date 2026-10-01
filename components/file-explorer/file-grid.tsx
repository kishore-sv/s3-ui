"use client";

import type { ExplorerItem } from "@/types/explorer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/utils/formatExplorer";
import { FileIcon } from "./file-icon";
import { FileActionMenu, FileContextMenuItems, useFileActions } from "./file-actions";
import { useExplorer } from "./explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { TableLoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

function FileGridItem({
  item,
  onDelete,
}: {
  item: ExplorerItem;
  onDelete: (item: ExplorerItem) => void;
}) {
  const { selectedKeys, toggleSelection } = useExplorer();
  const { openItem } = useFileActions();
  const isSelected = selectedKeys.has(item.key);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            "group relative flex h-auto w-full flex-col items-center gap-2 self-start rounded-lg border p-4 cursor-pointer hover:bg-accent/50 transition-colors",
            isSelected && "bg-accent/50 border-primary/30"
          )}
          onClick={() => toggleSelection(item.key)}
          onDoubleClick={() => openItem(item)}
        >
          <div
            className="absolute top-2 left-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelection(item.key)}
            />
          </div>
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <FileActionMenu item={item} onDelete={onDelete} />
          </div>
          <FileIcon
            name={item.name}
            type={item.type}
            className="h-10 w-10"
          />
          <div className="text-center min-w-0 w-full">
            <p className="text-sm font-medium truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">
              {item.type === "folder"
                ? "Folder"
                : item.size !== undefined
                  ? formatBytes(item.size)
                  : "File"}
            </p>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <FileContextMenuItems item={item} onDelete={onDelete} />
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FileGrid({
  onDelete,
}: {
  onDelete: (item: ExplorerItem) => void;
}) {
  const {
    isLoading,
    error: errorMessage,
    currentPath,
    refreshCurrentFolder,
    searchQuery,
  } = useExplorer();
  const { filteredItems } = useExplorerItems();

  if (errorMessage) {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={() => void refreshCurrentFolder()}
      />
    );
  }

  if (isLoading && filteredItems.length === 0) {
    return <TableLoadingState />;
  }

  if (!isLoading && filteredItems.length === 0) {
    if (searchQuery) {
      return (
        <div className="py-16 text-center text-muted-foreground">
          No results for &ldquo;{searchQuery}&rdquo;
        </div>
      );
    }
    return <EmptyState isRoot={!currentPath} />;
  }

  return (
    <div className="grid auto-rows-min grid-cols-2 content-start items-start gap-3 overflow-auto p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-1 min-h-0">
      {filteredItems.map((item) => (
        <FileGridItem key={item.key} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
