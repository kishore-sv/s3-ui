"use client";

import { Upload, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StorageProviderIcon from "@/components/storage-provider-icon";
import { useExplorer } from "./explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { formatBytes, getDisplayName } from "@/utils/formatExplorer";

export function ExplorerStorageHeader() {
  const {
    storageConfig,
    provider,
    providerInfo,
    connectionStatus,
    currentPath,
    setUploadOpen,
    setNewFolderOpen,
  } = useExplorer();
  const { folderCount, fileCount, totalSize } = useExplorerItems();

  const displayName = currentPath
    ? getDisplayName(currentPath)
    : storageConfig?.bucketName ?? "Bucket";

  const statusLabel =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "connecting"
        ? "Connecting..."
        : "Connection error";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold truncate">{displayName}</h2>
          <Badge
            variant={
              connectionStatus === "connected" ? "default" : "destructive"
            }
            className="text-[10px] shrink-0"
          >
            {statusLabel}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <StorageProviderIcon provider={provider} size={14} />
          <span>{providerInfo.name}</span>
          {storageConfig?.endpoint && (
            <>
              <span>·</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate max-w-[200px]">
                    {storageConfig.endpoint}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{storageConfig.endpoint}</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {fileCount} {fileCount === 1 ? "file" : "files"} · {folderCount}{" "}
          {folderCount === 1 ? "folder" : "folders"}
          {totalSize > 0 && ` · ${formatBytes(totalSize)}`}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setNewFolderOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>
    </div>
  );
}
