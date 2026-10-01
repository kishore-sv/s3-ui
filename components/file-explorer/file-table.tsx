"use client";

import type { ExplorerItem, SortField } from "@/types/explorer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExplorer } from "./explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { FileTableRow, FileMobileRow } from "./file-table-row";
import { TableLoadingState } from "./loading-state";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";

function SortHeader({
  field,
  label,
  className,
}: {
  field: SortField;
  label: string;
  className?: string;
}) {
  const { sortField, sortDirection, setSortField, setSortDirection } =
    useExplorer();

  const handleClick = () => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <TableHead
      className={cn("cursor-pointer select-none hover:text-foreground", className)}
      onClick={handleClick}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </span>
    </TableHead>
  );
}

export function FileTable({
  onDelete,
}: {
  onDelete: (item: ExplorerItem) => void;
}) {
  const {
    isLoading,
    error: errorMessage,
    currentPath,
    selectedKeys,
    selectAll,
    clearSelection,
    refreshCurrentFolder,
    searchQuery,
  } = useExplorer();
  const { filteredItems } = useExplorerItems();

  const allKeys = filteredItems.map((i) => i.key);
  const allSelected =
    allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k));
  const someSelected = allKeys.some((k) => selectedKeys.has(k));

  if (errorMessage) {
    return (
      <ErrorState
        message={errorMessage}
        onRetry={() => void refreshCurrentFolder()}
      />
    );
  }

  if (isLoading && filteredItems.length === 0) {
    return <TableLoadingState />;
  }

  if (!isLoading && filteredItems.length === 0) {
    if (searchQuery) {
      return (
        <div className="py-16 text-center text-muted-foreground">
          No results for &ldquo;{searchQuery}&rdquo;
        </div>
      );
    }
    return <EmptyState isRoot={!currentPath} />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block flex-1 min-h-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => {
                      if (checked) selectAll(allKeys);
                      else clearSelection();
                    }}
                    aria-label="Select all"
                  />
                </TableHead>
                <SortHeader field="name" label="Name" />
                <SortHeader field="type" label="Type" className="hidden md:table-cell" />
                <SortHeader field="size" label="Size" className="hidden md:table-cell" />
                <SortHeader field="modified" label="Modified" className="hidden lg:table-cell" />
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <FileTableRow key={item.key} item={item} onDelete={onDelete} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Mobile list */}
      <div className="md:hidden flex-1 min-h-0 overflow-auto">
        {filteredItems.map((item) => (
          <FileMobileRow key={item.key} item={item} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}
