"use client";

import {
  Upload,
  FolderPlus,
  RefreshCw,
  List,
  Grid2X2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useExplorer } from "./explorer-context";

export function ExplorerToolbar() {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    setUploadOpen,
    setNewFolderOpen,
    refreshCurrentFolder,
    isLoading,
  } = useExplorer();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-4 py-2 border-b">
      <div className="flex gap-1.5">
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setNewFolderOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          <span className="hidden sm:inline">New Folder</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => void refreshCurrentFolder()}
          disabled={isLoading}
          aria-label="Refresh"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <div className="flex-1 relative md:hidden">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8"
        />
        {searchQuery && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {searchQuery && (
        <p className="text-xs text-muted-foreground hidden sm:block">
          Showing results for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      <div className="flex gap-0.5 ml-auto">
        <Button
          size="sm"
          variant={viewMode === "list" ? "secondary" : "ghost"}
          onClick={() => setViewMode("list")}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          onClick={() => setViewMode("grid")}
          aria-label="Grid view"
        >
          <Grid2X2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
