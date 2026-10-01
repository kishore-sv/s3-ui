"use client";

import { useMemo } from "react";
import type { ExplorerItem, SortDirection, SortField } from "@/types/explorer";
import { mapObjectsToExplorerItems } from "@/utils/mapObjectsToExplorerItems";
import { getFileTypeLabel } from "@/utils/formatExplorer";
import { useExplorer } from "@/components/file-explorer/explorer-context";

function sortItems(
  items: ExplorerItem[],
  field: SortField,
  direction: SortDirection
): ExplorerItem[] {
  const folders = items.filter((i) => i.type === "folder");
  const files = items.filter((i) => i.type === "file");

  const compare = (a: ExplorerItem, b: ExplorerItem): number => {
    let result = 0;
    switch (field) {
      case "name":
        result = a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
        break;
      case "type":
        result =
          a.type === b.type
            ? getFileTypeLabel(a.name).localeCompare(
                getFileTypeLabel(b.name),
                undefined,
                { sensitivity: "base" }
              )
            : a.type.localeCompare(b.type);
        break;
      case "size":
        result = (a.size ?? 0) - (b.size ?? 0);
        break;
      case "modified":
        result =
          new Date(a.lastModified ?? 0).getTime() -
          new Date(b.lastModified ?? 0).getTime();
        break;
    }
    return direction === "asc" ? result : -result;
  };

  folders.sort(compare);
  files.sort(compare);

  return [...folders, ...files];
}

export function useExplorerItems(): {
  items: ExplorerItem[];
  filteredItems: ExplorerItem[];
  folderCount: number;
  fileCount: number;
  totalSize: number;
} {
  const {
    currentData,
    currentPath,
    searchQuery,
    sortField,
    sortDirection,
  } = useExplorer();

  const items = useMemo(() => {
    if (!currentData) return [];
    return mapObjectsToExplorerItems(currentData, currentPath);
  }, [currentData, currentPath]);

  const sortedItems = useMemo(
    () => sortItems(items, sortField, sortDirection),
    [items, sortField, sortDirection]
  );

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return sortedItems;
    const query = searchQuery.toLowerCase();
    return sortedItems.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [sortedItems, searchQuery]);

  const folderCount = items.filter((i) => i.type === "folder").length;
  const fileCount = items.filter((i) => i.type === "file").length;
  const totalSize = items
    .filter((i) => i.type === "file")
    .reduce((acc, f) => acc + (f.size ?? 0), 0);

  return {
    items: sortedItems,
    filteredItems,
    folderCount,
    fileCount,
    totalSize,
  };
}
