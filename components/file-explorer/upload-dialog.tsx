"use client";

import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/utils/formatExplorer";
import { uploadObject, buildUploadKey } from "@/utils/uploadObject";
import { UploadDropzone } from "./upload-dropzone";
import { useExplorer } from "./explorer-context";

type UploadStatus = "queued" | "uploading" | "success" | "failed";

type QueueItem = {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
};

export function UploadDialog() {
  const {
    uploadOpen,
    setUploadOpen,
    storageConfig,
    currentPath,
    refreshCurrentFolder,
    invalidateFolder,
  } = useExplorer();

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const destination = storageConfig
    ? `${storageConfig.bucketName}${currentPath ? ` / ${currentPath.replace(/\/$/, "").split("/").join(" / ")}` : ""}`
    : "";

  const addFiles = (files: File[]) => {
    const newItems: QueueItem[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      status: "queued",
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((i) => i.id !== id));
  };

  const startUpload = async () => {
    if (!storageConfig || queue.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of queue) {
      if (item.status === "success") {
        successCount++;
        continue;
      }

      setQueue((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "uploading", progress: 0 } : i
        )
      );

      try {
        const key = buildUploadKey(item.file.name, currentPath);
        await uploadObject(item.file, key, storageConfig, (progress) => {
          setQueue((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, progress } : i
            )
          );
        });
        setQueue((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "success", progress: 100 }
              : i
          )
        );
        successCount++;
      } catch {
        setQueue((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "failed" } : i
          )
        );
        failCount++;
      }
    }

    setIsUploading(false);
    invalidateFolder(currentPath);
    await refreshCurrentFolder();

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "1 file uploaded successfully"
          : `${successCount} files uploaded successfully`
      );
    }
    if (failCount > 0) {
      toast.error(
        failCount === 1
          ? "1 file failed to upload"
          : `${failCount} files failed to upload`
      );
    }

    if (failCount === 0) {
      setQueue([]);
      setUploadOpen(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isUploading) {
      setUploadOpen(open);
      if (!open) setQueue([]);
    }
  };

  return (
    <Dialog open={uploadOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            Upload to: <span className="font-medium text-foreground">{destination}</span>
          </DialogDescription>
        </DialogHeader>

        <UploadDropzone onFilesSelected={addFiles} disabled={isUploading} />

        {queue.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-auto">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-sm border rounded-md px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.file.size)}
                  </p>
                  {item.status === "uploading" && (
                    <Progress value={item.progress} className="h-1 mt-1" />
                  )}
                </div>
                {item.status === "uploading" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {item.status === "success" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {item.status === "failed" && (
                  <span className="text-xs text-destructive">Failed</span>
                )}
                {item.status === "queued" && !isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFromQueue(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void startUpload()}
            disabled={queue.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${queue.length > 0 ? `(${queue.length})` : ""}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
