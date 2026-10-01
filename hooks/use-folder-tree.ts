"use client";

import { useCallback, useState } from "react";
import type { ExplorerItem, ObjectsResponse } from "@/types/explorer";
import { useExplorer } from "@/components/file-explorer/explorer-context";
import { mapObjectsToExplorerItems } from "@/utils/mapObjectsToExplorerItems";

export function useFolderTree() {
  const {
    loadFolderChildren,
    expandedFolders,
    toggleExpanded,
    folderCache,
    invalidateFolder,
    refreshFolder,
  } = useExplorer();

  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const [errorPaths, setErrorPaths] = useState<Set<string>>(new Set());

  const getChildren = useCallback(
    (path: string): string[] => {
      const data = folderCache.get(path);
      return data?.folders ?? [];
    },
    [folderCache]
  );

  const getFiles = useCallback(
    (path: string): ExplorerItem[] => {
      const data = folderCache.get(path);
      if (!data) return [];
      return mapObjectsToExplorerItems(data, path)
        .filter((item) => item.type === "file")
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    },
    [folderCache]
  );

  const ensureExpanded = useCallback(
    async (path: string) => {
      if (expandedFolders.has(path)) {
        if (!folderCache.has(path)) {
          setLoadingPaths((prev) => new Set(prev).add(path));
          try {
            await loadFolderChildren(path);
          } catch {
            setErrorPaths((prev) => new Set(prev).add(path));
          } finally {
            setLoadingPaths((prev) => {
              const next = new Set(prev);
              next.delete(path);
              return next;
            });
          }
        }
        return;
      }

      toggleExpanded(path);

      if (folderCache.has(path)) return;

      setLoadingPaths((prev) => new Set(prev).add(path));
      setErrorPaths((prev) => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });

      try {
        await loadFolderChildren(path);
      } catch {
        setErrorPaths((prev) => new Set(prev).add(path));
      } finally {
        setLoadingPaths((prev) => {
          const next = new Set(prev);
          next.delete(path);
          return next;
        });
      }
    },
    [expandedFolders, toggleExpanded, folderCache, loadFolderChildren]
  );

  const expandFolder = useCallback(
    async (path: string) => {
      if (expandedFolders.has(path)) {
        toggleExpanded(path);
        return;
      }
      await ensureExpanded(path);
    },
    [expandedFolders, toggleExpanded, ensureExpanded]
  );

  const refreshTreeFolder = useCallback(
    async (path: string): Promise<ObjectsResponse | null> => {
      invalidateFolder(path);
      setLoadingPaths((prev) => new Set(prev).add(path));
      try {
        const data = await refreshFolder(path);
        return data;
      } finally {
        setLoadingPaths((prev) => {
          const next = new Set(prev);
          next.delete(path);
          return next;
        });
      }
    },
    [invalidateFolder, refreshFolder]
  );

  const isLoading = useCallback(
    (path: string) => loadingPaths.has(path),
    [loadingPaths]
  );

  const hasError = useCallback(
    (path: string) => errorPaths.has(path),
    [errorPaths]
  );

  const hasChildren = useCallback(
    (path: string) => {
      const data = folderCache.get(path);
      if (!data) return null; // unknown
      return (data.folders?.length ?? 0) > 0;
    },
    [folderCache]
  );

  return {
    getChildren,
    getFiles,
    expandFolder,
    ensureExpanded,
    refreshTreeFolder,
    isLoading,
    hasError,
    hasChildren,
    expandedFolders,
  };
}
