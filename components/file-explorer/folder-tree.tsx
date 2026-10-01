"use client";

import { useEffect } from "react";
import { FolderPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderTreeItem } from "./folder-tree-item";
import { SidebarLoadingState } from "./loading-state";
import { useExplorer } from "./explorer-context";
import { useFolderTree } from "@/hooks/use-folder-tree";
import type { ExplorerItem } from "@/types/explorer";

export function FolderTree({
  onDelete,
  onNewFolder,
  onDeleteItem,
}: {
  onDelete: (path: string) => void;
  onNewFolder: (path: string) => void;
  onDeleteItem: (item: ExplorerItem) => void;
}) {
  const { isLoading, refreshCurrentFolder, setNewFolderOpen, folderCache } =
    useExplorer();
  const { ensureExpanded } = useFolderTree();
  const hasRootData = folderCache.has("");

  useEffect(() => {
    void ensureExpanded("");
  }, [ensureExpanded]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Storage
        </span>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setNewFolderOpen(true)}
            aria-label="New folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => void refreshCurrentFolder()}
            aria-label="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-1 pb-2">
        {isLoading && !hasRootData ? (
          <SidebarLoadingState />
        ) : (
          <FolderTreeItem
            path=""
            depth={0}
            onDelete={onDelete}
            onNewFolder={onNewFolder}
            onDeleteItem={onDeleteItem}
          />
        )}
      </div>
    </div>
  );
}
