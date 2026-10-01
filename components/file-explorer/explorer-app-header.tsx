"use client";

import Image from "next/image";
import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/toggle-theme-button";
import StorageProviderIcon from "@/components/storage-provider-icon";
import { useExplorer } from "./explorer-context";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function ExplorerAppHeader() {
  const {
    provider,
    providerInfo,
    connectionStatus,
    searchQuery,
    setSearchQuery,
    handleSignOut,
  } = useExplorer();

  const statusLabel =
    connectionStatus === "connected"
      ? "Connected"
      : connectionStatus === "connecting"
        ? "Connecting..."
        : "Connection error";

  const statusVariant =
    connectionStatus === "connected"
      ? "default"
      : connectionStatus === "connecting"
        ? "secondary"
        : "destructive";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 min-w-0">
        <Image src="/logo.svg" alt="S3-UI" width={24} height={24} />
        <div className="min-w-0">
          <h1 className="text-sm font-semibold leading-none">S3-UI</h1>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Storage Explorer
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
          <StorageProviderIcon provider={provider} size={18} />
          <span className="truncate max-w-[120px]">{providerInfo.shortName}</span>
          <Badge variant={statusVariant} className="text-[10px] px-1.5 py-0">
            {statusLabel}
          </Badge>
        </div>
        <ModeToggle />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="hidden sm:flex"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Remove Keys</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleSignOut}
          className="sm:hidden"
          aria-label="Remove keys"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
