"use client";

import {
  Copy,
  Download,
  Eye,
  FolderPlus,
  Info,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { ExplorerItem } from "@/types/explorer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { getPresignedObjectUrl } from "@/utils/storageConfig";
import { useExplorer } from "./explorer-context";

export function useFileActions() {
  const {
    storageConfig,
    navigateTo,
    setDetailsItem,
    setPreviewItem,
    setNewFolderOpen,
  } = useExplorer();

  const openItem = (item: ExplorerItem) => {
    if (item.type === "folder") {
      navigateTo(item.path);
    } else {
      setPreviewItem(item);
    }
  };

  const downloadItem = async (item: ExplorerItem) => {
    if (!storageConfig || item.type !== "file") return;
    try {
      const url = await getPresignedObjectUrl(storageConfig, item.key);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      a.click();
    } catch {
      toast.error("Couldn't download the file");
    }
  };

  const copyPath = (item: ExplorerItem) => {
    void navigator.clipboard.writeText(item.key);
    toast.success("Path copied to clipboard");
  };

  const showDetails = (item: ExplorerItem) => {
    setDetailsItem(item);
  };

  const newFolderIn = (item: ExplorerItem) => {
    if (item.type === "folder") {
      navigateTo(item.path);
    }
    setNewFolderOpen(true);
  };

  return {
    openItem,
    downloadItem,
    copyPath,
    showDetails,
    newFolderIn,
  };
}

export function FileActionMenu({
  item,
  onDelete,
  trigger,
}: {
  item: ExplorerItem;
  onDelete: (item: ExplorerItem) => void;
  trigger?: React.ReactNode;
}) {
  const { openItem, downloadItem, copyPath, showDetails, newFolderIn } =
    useFileActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => openItem(item)}>
          <Eye className="h-4 w-4" />
          {item.type === "folder" ? "Open" : "Preview"}
        </DropdownMenuItem>
        {item.type === "file" && (
          <DropdownMenuItem onClick={() => void downloadItem(item)}>
            <Download className="h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
        {item.type === "folder" && (
          <DropdownMenuItem onClick={() => newFolderIn(item)}>
            <FolderPlus className="h-4 w-4" />
            New Folder
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => copyPath(item)}>
          <Copy className="h-4 w-4" />
          Copy path
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => showDetails(item)}>
          <Info className="h-4 w-4" />
          Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FileContextMenuItems({
  item,
  onDelete,
}: {
  item: ExplorerItem;
  onDelete: (item: ExplorerItem) => void;
}) {
  const { openItem, downloadItem, copyPath, showDetails, newFolderIn } =
    useFileActions();

  return (
    <>
      <ContextMenuItem onClick={() => openItem(item)}>
        <Eye className="h-4 w-4" />
        {item.type === "folder" ? "Open" : "Preview"}
      </ContextMenuItem>
      {item.type === "file" && (
        <ContextMenuItem onClick={() => void downloadItem(item)}>
          <Download className="h-4 w-4" />
          Download
        </ContextMenuItem>
      )}
      {item.type === "folder" && (
        <ContextMenuItem onClick={() => newFolderIn(item)}>
          <FolderPlus className="h-4 w-4" />
          New Folder
        </ContextMenuItem>
      )}
      <ContextMenuItem onClick={() => copyPath(item)}>
        <Copy className="h-4 w-4" />
        Copy path
      </ContextMenuItem>
      <ContextMenuItem onClick={() => showDetails(item)}>
        <Info className="h-4 w-4" />
        Details
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        className="text-destructive"
        onClick={() => onDelete(item)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </ContextMenuItem>
    </>
  );
}
