"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import StorageProviderIcon from "@/components/storage-provider-icon";
import { FolderTree } from "./folder-tree";
import { SidebarResizeHandle } from "./sidebar-resize-handle";
import { useExplorer } from "./explorer-context";
import { getDisplayName } from "@/utils/formatExplorer";

export function ExplorerSidebar({
  onDelete,
  onNewFolder,
}: {
  onDelete: (path: string) => void;
  onNewFolder: (path: string) => void;
}) {
  const {
    storageConfig,
    provider,
    providerInfo,
    connectionStatus,
  } = useExplorer();

  const statusLabel =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "connecting"
        ? "Connecting..."
        : "Error";

  return (
    <Sidebar collapsible="icon" className="border-r relative">
      <SidebarHeader className="border-b px-3 py-2">
        <div className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]:justify-center">
          <StorageProviderIcon provider={provider} size={20} />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium truncate">
              {storageConfig?.bucketName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {getDisplayName(storageConfig?.bucketName ?? "")}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <FolderTree onDelete={onDelete} onNewFolder={onNewFolder} />
      </SidebarContent>
      <SidebarFooter className="border-t p-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Storage Provider</p>
            <p className="text-sm font-medium truncate">{providerInfo.name}</p>
          </div>
          <Badge
            variant={
              connectionStatus === "connected" ? "default" : "secondary"
            }
            className="shrink-0 text-[10px]"
          >
            {statusLabel}
          </Badge>
        </div>
      </SidebarFooter>
      <SidebarRail />
      <SidebarResizeHandle />
    </Sidebar>
  );
}
