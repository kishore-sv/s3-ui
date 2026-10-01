"use client";

import { useEffect } from "react";
import { FolderPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderTreeItem } from "./folder-tree-item";
import { SidebarLoadingState } from "./loading-state";
import { useExplorer } from "./explorer-context";
import { useFolderTree } from "@/hooks/use-folder-tree";

export function FolderTree({
  onDelete,
  onNewFolder,
}: {
  onDelete: (path: string) => void;
  onNewFolder: (path: string) => void;
}) {
  const { isLoading, refreshCurrentFolder, setNewFolderOpen, folderCache } =
    useExplorer();
  const { ensureExpanded } = useFolderTree();
  const hasRootData = folderCache.has("");

  useEffect(() => {
    void ensureExpanded("");
  }, [ensureExpanded]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2">
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

      <ScrollArea className="flex-1 px-1">
        {isLoading && !hasRootData ? (
          <SidebarLoadingState />
        ) : (
          <>
            <FolderTreeItem
              path=""
              depth={0}
              onDelete={onDelete}
              onNewFolder={onNewFolder}
            />
          </>
        )}
      </ScrollArea>
    </div>
  );
}
