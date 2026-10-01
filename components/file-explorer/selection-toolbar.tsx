"use client";

import { Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExplorer } from "./explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { getPresignedObjectUrl } from "@/utils/storageConfig";
import { toast } from "sonner";

export function SelectionToolbar({
  onBulkDelete,
}: {
  onBulkDelete: () => void;
}) {
  const { selectedKeys, clearSelection, storageConfig } = useExplorer();
  const { items } = useExplorerItems();

  if (selectedKeys.size === 0) return null;

  const selectedItems = items.filter((i) => selectedKeys.has(i.key));
  const fileItems = selectedItems.filter((i) => i.type === "file");

  const handleDownload = async () => {
    if (!storageConfig) return;
    for (const item of fileItems) {
      try {
        const url = await getPresignedObjectUrl(storageConfig, item.key);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name;
        a.click();
      } catch {
        toast.error(`Couldn't download ${item.name}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2 bg-accent/50 border-b">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearSelection}>
          <X className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {selectedKeys.size} {selectedKeys.size === 1 ? "item" : "items"} selected
        </span>
      </div>
      <div className="flex gap-1.5">
        {fileItems.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => void handleDownload()}>
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
        <Button size="sm" variant="destructive" onClick={onBulkDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
