"use client";

import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResizableSidebarProvider } from "@/hooks/use-resizable-sidebar";
import type { ExplorerItem } from "@/types/explorer";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useExplorer } from "./explorer-context";
import { ExplorerAppHeader } from "./explorer-app-header";
import { ExplorerSidebar } from "./explorer-sidebar";
import { ExplorerBreadcrumbs } from "./explorer-breadcrumbs";
import { ExplorerStorageHeader } from "./explorer-storage-header";
import { ExplorerToolbar } from "./explorer-toolbar";
import { FileTable } from "./file-table";
import { FileGrid } from "./file-grid";
import { SelectionToolbar } from "./selection-toolbar";
import { UploadDialog } from "./upload-dialog";
import { NewFolderDialog } from "./new-folder-dialog";
import { ExplorerDeleteDialog } from "./explorer-delete-dialog";
import { FileDetailsSheet } from "./file-details-sheet";
import { FilePreviewDialog } from "./file-preview-dialog";
import { ExplorerCommand } from "./explorer-command";
import { ExplorerStatusBar } from "./explorer-status-bar";

function FileExplorerInner() {
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "single"; item: ExplorerItem }
    | { type: "bulk"; items: ExplorerItem[] }
    | null
  >(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newFolderParent, setNewFolderParent] = useState<string | undefined>();

  const {
    viewMode,
    clearSelection,
    setUploadOpen,
    setNewFolderOpen,
    navigateTo,
    selectedKeys,
  } = useExplorer();

  const { items } = useExplorerItems();

  const handleDelete = useCallback((item: ExplorerItem) => {
    setDeleteTarget({ type: "single", item });
    setDeleteOpen(true);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const selected = items.filter((i) => selectedKeys.has(i.key));
    if (selected.length > 0) {
      setDeleteTarget({ type: "bulk", items: selected });
      setDeleteOpen(true);
    }
  }, [items, selectedKeys]);

  const handleSidebarDelete = useCallback((path: string) => {
    const segments = path.replace(/\/$/, "").split("/").filter(Boolean);
    const item: ExplorerItem = {
      key: path,
      name: segments[segments.length - 1] || "Root",
      type: "folder",
      path,
      parentPath:
        segments.length > 1 ? `${segments.slice(0, -1).join("/")}/` : "",
    };
    setDeleteTarget({ type: "single", item });
    setDeleteOpen(true);
  }, []);

  const handleSidebarNewFolder = useCallback(
    (path: string) => {
      navigateTo(path);
      setNewFolderParent(path);
      setNewFolderOpen(true);
    },
    [navigateTo, setNewFolderOpen]
  );

  const handleDeleted = useCallback(() => {
    clearSelection();
    setDeleteTarget(null);
  }, [clearSelection]);

  useKeyboardShortcuts({ onDeleteSelected: handleDeleteSelected });

  return (
    <div className="flex h-dvh w-full flex-col">
      <ExplorerAppHeader />
      <div className="flex flex-1 min-h-0">
        <ExplorerSidebar
          onDelete={handleSidebarDelete}
          onNewFolder={handleSidebarNewFolder}
        />
        <SidebarInset className="flex flex-col min-h-0">
          <ExplorerBreadcrumbs />
          <ExplorerStorageHeader />
          <ExplorerToolbar />
          <SelectionToolbar onBulkDelete={handleDeleteSelected} />
          <div
            className={cn("relative flex flex-col flex-1 min-h-0")}
            onDragOver={(e) => {
              e.preventDefault();
              if (e.dataTransfer.types.includes("Files")) setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files.length > 0) setUploadOpen(true);
            }}
          >
            {isDragOver && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 border-2 border-dashed border-primary rounded-lg m-2 pointer-events-none">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-primary" />
                  <p className="text-sm font-medium">Drop files to upload</p>
                </div>
              </div>
            )}
            {viewMode === "list" ? (
              <FileTable onDelete={handleDelete} />
            ) : (
              <FileGrid onDelete={handleDelete} />
            )}
          </div>
          <ExplorerStatusBar />
        </SidebarInset>
      </div>

      <UploadDialog />
      <NewFolderDialog parentPathOverride={newFolderParent} />
      <ExplorerDeleteDialog
        target={deleteTarget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={handleDeleted}
      />
      <FileDetailsSheet />
      <FilePreviewDialog />
      <ExplorerCommand onDeleteSelected={handleDeleteSelected} />
    </div>
  );
}

export function FileExplorer() {
  return (
    <TooltipProvider>
      <ResizableSidebarProvider>
        <FileExplorerInner />
      </ResizableSidebarProvider>
    </TooltipProvider>
  );
}
