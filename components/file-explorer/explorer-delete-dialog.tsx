"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ExplorerItem } from "@/types/explorer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteObject } from "@/utils/deleteObject";
import { deleteFolder } from "@/utils/deleteFolder";
import { countFolderContents } from "@/utils/countFolderContents";
import { getDisplayName } from "@/utils/formatExplorer";
import { useExplorer } from "./explorer-context";

type DeleteTarget =
  | { type: "single"; item: ExplorerItem }
  | { type: "bulk"; items: ExplorerItem[] };

export function ExplorerDeleteDialog({
  target,
  open,
  onOpenChange,
  onDeleted,
}: {
  target: DeleteTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}) {
  const { storageConfig, refreshCurrentFolder, invalidateFolder, currentPath } =
    useExplorer();
  const [isDeleting, setIsDeleting] = useState(false);
  const [folderCount, setFolderCount] = useState<number | null>(null);
  const [folderTruncated, setFolderTruncated] = useState(false);

  useEffect(() => {
    if (!open || !target || !storageConfig) {
      setFolderCount(null);
      return;
    }

    const item =
      target.type === "single" ? target.item : null;
    if (item?.type === "folder") {
      void countFolderContents(item.path, storageConfig).then((result) => {
        setFolderCount(result.count);
        setFolderTruncated(result.isTruncated);
      });
    } else {
      setFolderCount(null);
    }
  }, [open, target, storageConfig]);

  const handleDelete = async () => {
    if (!storageConfig || !target) return;

    setIsDeleting(true);
    try {
      const items =
        target.type === "single" ? [target.item] : target.items;

      for (const item of items) {
        if (item.type === "folder") {
          await deleteFolder(item.path, storageConfig);
          invalidateFolder(item.parentPath);
        } else {
          await deleteObject(item.key, storageConfig);
        }
      }

      invalidateFolder(currentPath);
      await refreshCurrentFolder();
      onDeleted?.();
      onOpenChange(false);

      if (items.length === 1) {
        toast.success(`"${getDisplayName(items[0].key)}" was deleted`);
      } else {
        toast.success(`${items.length} items deleted`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Couldn't delete the item(s)");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!target) return null;

  const getTitle = () => {
    if (target.type === "bulk") {
      return `Delete ${target.items.length} items?`;
    }
    const item = target.item;
    return item.type === "folder" ? "Delete folder?" : `Delete "${item.name}"?`;
  };

  const getDescription = () => {
    if (target.type === "bulk") {
      const folders = target.items.filter((i) => i.type === "folder").length;
      const files = target.items.filter((i) => i.type === "file").length;
      const parts: string[] = [];
      if (folders > 0) parts.push(`${folders} folder${folders > 1 ? "s" : ""}`);
      if (files > 0) parts.push(`${files} file${files > 1 ? "s" : ""}`);
      return `This will permanently delete ${parts.join(" and ")}. This action cannot be undone.`;
    }

    const item = target.item;
    if (item.type === "folder") {
      if (folderCount === null) {
        return `Delete "${item.name}"? This action cannot be undone.`;
      }
      if (folderCount === 0) {
        return `Delete "${item.name}"? This folder is empty.`;
      }
      const countStr = folderTruncated
        ? `at least ${folderCount}`
        : String(folderCount);
      return `This folder contains ${countStr} item${folderCount !== 1 ? "s" : ""}. Deleting it will remove the folder and all its contents.`;
    }

    return "This action cannot be undone.";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription>{getDescription()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              void handleDelete();
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : target.type === "bulk" ? (
              `Delete ${target.items.length} items`
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
