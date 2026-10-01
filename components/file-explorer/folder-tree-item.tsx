"use client";

import { ChevronDown, ChevronRight, Loader2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileIcon } from "./file-icon";
import { FileTreeItem } from "./file-tree-item";
import { TreeItemName } from "./tree-item-name";
import { useExplorer } from "./explorer-context";
import { useFolderTree } from "@/hooks/use-folder-tree";
import { getDisplayName } from "@/utils/formatExplorer";
import type { ExplorerItem } from "@/types/explorer";

export function FolderTreeItem({
  path,
  depth = 0,
  onDelete,
  onNewFolder,
  onDeleteItem,
}: {
  path: string;
  depth?: number;
  onDelete: (path: string) => void;
  onNewFolder: (path: string) => void;
  onDeleteItem: (item: ExplorerItem) => void;
}) {
  const { currentPath, navigateTo } = useExplorer();
  const {
    getChildren,
    getFiles,
    expandFolder,
    isLoading,
    expandedFolders,
    refreshTreeFolder,
  } = useFolderTree();

  const name = path === "" ? "Root" : getDisplayName(path);
  const fullTitle = path === "" ? "Root" : path;
  const isExpanded = expandedFolders.has(path);
  const isSelected = currentPath === path;
  const childFolders = isExpanded ? getChildren(path) : [];
  const childFiles = isExpanded ? getFiles(path) : [];
  const loading = isLoading(path);

  const handleClick = () => {
    navigateTo(path);
  };

  const handleChevron = (e: React.MouseEvent) => {
    e.stopPropagation();
    void expandFolder(path);
  };

  return (
    <div className="min-w-0">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              "group flex w-full min-w-0 items-center gap-0.5 overflow-hidden rounded-md px-1 py-1 text-sm cursor-pointer hover:bg-accent",
              isSelected && "bg-accent font-medium"
            )}
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
            onClick={handleClick}
          >
            <button
              type="button"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded hover:bg-muted"
              onClick={handleChevron}
              aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
            <FileIcon
              name={name}
              type="folder"
              isOpen={isExpanded}
              className="h-3.5 w-3.5 shrink-0"
            />
            <TreeItemName name={name} title={fullTitle} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Actions for ${name}`}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => navigateTo(path)}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewFolder(path)}>
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => void refreshTreeFolder(path)}
                >
                  Refresh
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(path)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => navigateTo(path)}>
            Open
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onNewFolder(path)}>
            New Folder
          </ContextMenuItem>
          <ContextMenuItem onClick={() => void refreshTreeFolder(path)}>
            Refresh
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-destructive"
            onClick={() => onDelete(path)}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && (
        <>
          {childFolders.map((childPath) => (
            <FolderTreeItem
              key={childPath}
              path={childPath}
              depth={depth + 1}
              onDelete={onDelete}
              onNewFolder={onNewFolder}
              onDeleteItem={onDeleteItem}
            />
          ))}
          {childFiles.map((file) => (
            <FileTreeItem
              key={file.key}
              file={file}
              depth={depth + 1}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </>
      )}
    </div>
  );
}
