"use client";

import {
  Download,
  FolderPlus,
  Grid2X2,
  Home,
  List,
  PanelLeft,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useExplorer } from "./explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { useSidebar } from "@/components/ui/sidebar";
import { useFileActions } from "./file-actions";

export function ExplorerCommand({
  onDeleteSelected,
}: {
  onDeleteSelected: () => void;
}) {
  const {
    commandOpen,
    setCommandOpen,
    setUploadOpen,
    setNewFolderOpen,
    refreshCurrentFolder,
    navigateTo,
    setViewMode,
    viewMode,
    selectedKeys,
  } = useExplorer();
  const { filteredItems } = useExplorerItems();
  const { toggleSidebar } = useSidebar();
  const { openItem, downloadItem } = useFileActions();

  const run = (fn: () => void) => {
    setCommandOpen(false);
    fn();
  };

  const selectedItems = filteredItems.filter((i) =>
    selectedKeys.has(i.key)
  );
  const selectedFiles = selectedItems.filter((i) => i.type === "file");

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => setUploadOpen(true))}>
            <Upload className="h-4 w-4" />
            Upload files
          </CommandItem>
          <CommandItem onSelect={() => run(() => setNewFolderOpen(true))}>
            <FolderPlus className="h-4 w-4" />
            New folder
          </CommandItem>
          <CommandItem onSelect={() => run(() => void refreshCurrentFolder())}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigateTo(""))}>
            <Home className="h-4 w-4" />
            Go to root
          </CommandItem>
          <CommandItem onSelect={() => run(() => toggleSidebar())}>
            <PanelLeft className="h-4 w-4" />
            Toggle sidebar
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => setViewMode(viewMode === "list" ? "grid" : "list"))
            }
          >
            {viewMode === "list" ? (
              <Grid2X2 className="h-4 w-4" />
            ) : (
              <List className="h-4 w-4" />
            )}
            Switch to {viewMode === "list" ? "grid" : "list"} view
          </CommandItem>
        </CommandGroup>

        {selectedKeys.size > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Selection">
              {selectedFiles.length > 0 && (
                <CommandItem
                  onSelect={() =>
                    run(() => {
                      for (const f of selectedFiles) {
                        void downloadItem(f);
                      }
                    })
                  }
                >
                  <Download className="h-4 w-4" />
                  Download selected
                </CommandItem>
              )}
              <CommandItem onSelect={() => run(onDeleteSelected)}>
                <Trash2 className="h-4 w-4" />
                Delete selected
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Files & Folders">
          {filteredItems.slice(0, 20).map((item) => (
            <CommandItem
              key={item.key}
              onSelect={() => run(() => openItem(item))}
            >
              <Search className="h-4 w-4" />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
