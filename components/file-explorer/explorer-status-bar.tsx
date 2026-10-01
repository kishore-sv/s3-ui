"use client";

import { useExplorer } from "./explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";

export function ExplorerStatusBar() {
  const { selectedKeys, connectionStatus, providerInfo } = useExplorer();
  const { filteredItems } = useExplorerItems();

  const statusText =
    connectionStatus === "connected"
      ? `${providerInfo.name} · Connected`
      : connectionStatus === "connecting"
        ? "Connecting..."
        : "Connection error";

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t px-4 text-[11px] text-muted-foreground">
      <span>
        {selectedKeys.size > 0
          ? `${selectedKeys.size} selected`
          : `${filteredItems.length} items`}
      </span>
      <span className="truncate">{statusText}</span>
    </footer>
  );
}
