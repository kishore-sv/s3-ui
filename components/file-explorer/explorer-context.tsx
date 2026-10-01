"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type {
  ConnectionStatus,
  ExplorerItem,
  ObjectsResponse,
  SortDirection,
  SortField,
  ViewMode,
} from "@/types/explorer";
import { useLocalPreference } from "@/hooks/use-local-preference";
import { fetchObjects } from "@/utils/fetchObjects";
import {
  clearStorageConfig,
  detectProvider,
  getProviderInfo,
  getStorageConfigFromLocalStorage,
  type StorageConfig,
  type StorageProvider,
} from "@/utils/storageConfig";
import { StorageApiError } from "@/utils/storageErrors";

type ExplorerContextValue = {
  storageConfig: StorageConfig | null;
  provider: StorageProvider;
  providerInfo: ReturnType<typeof getProviderInfo>;
  currentPath: string;
  selectedKeys: Set<string>;
  expandedFolders: Set<string>;
  viewMode: ViewMode;
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  detailsItem: ExplorerItem | null;
  previewItem: ExplorerItem | null;
  connectionStatus: ConnectionStatus;
  folderCache: Map<string, ObjectsResponse>;
  currentData: ObjectsResponse | null;
  isLoading: boolean;
  error: string | null;
  uploadOpen: boolean;
  newFolderOpen: boolean;
  commandOpen: boolean;
  navigateTo: (path: string) => void;
  refreshCurrentFolder: () => Promise<void>;
  refreshFolder: (path: string) => Promise<ObjectsResponse | null>;
  invalidateFolder: (path: string) => void;
  toggleSelection: (key: string) => void;
  selectAll: (keys: string[]) => void;
  clearSelection: () => void;
  setSelectedKeys: (keys: Set<string>) => void;
  toggleExpanded: (path: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (dir: SortDirection) => void;
  setSearchQuery: (query: string) => void;
  setDetailsItem: (item: ExplorerItem | null) => void;
  setPreviewItem: (item: ExplorerItem | null) => void;
  setUploadOpen: (open: boolean) => void;
  setNewFolderOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  handleSignOut: () => void;
  loadFolderChildren: (path: string) => Promise<ObjectsResponse>;
};

const ExplorerContext = createContext<ExplorerContextValue | null>(null);

function pathFromUrlParam(param: string | null): string {
  if (!param) return "";
  const decoded = decodeURIComponent(param);
  if (!decoded) return "";
  return decoded.endsWith("/") ? decoded : `${decoded}/`;
}

function pathToUrlParam(path: string): string | null {
  if (!path) return null;
  const trimmed = path.endsWith("/") ? path.slice(0, -1) : path;
  return trimmed || null;
}

function getAncestorPaths(path: string): string[] {
  const paths: string[] = [""];
  const segments = path.replace(/\/$/, "").split("/").filter(Boolean);
  let built = "";
  for (const segment of segments) {
    built += `${segment}/`;
    paths.push(built);
  }
  return paths;
}

function getExplorerErrorMessage(err: unknown): string {
  if (err instanceof StorageApiError) {
    return err.message;
  }
  return "Unable to load this folder. Please try again.";
}

export function ExplorerProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  const [storageConfig, setStorageConfig] = useState<StorageConfig | null>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsItem, setDetailsItem] = useState<ExplorerItem | null>(null);
  const [previewItem, setPreviewItem] = useState<ExplorerItem | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [folderCache, setFolderCache] = useState<
    Map<string, ObjectsResponse>
  >(new Map());
  const [currentData, setCurrentData] = useState<ObjectsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const [viewMode, setViewMode] = useLocalPreference<ViewMode>(
    "explorer-view-mode",
    "list"
  );
  const [sortField, setSortField] = useLocalPreference<SortField>(
    "explorer-sort-field",
    "name"
  );
  const [sortDirection, setSortDirection] = useLocalPreference<SortDirection>(
    "explorer-sort-direction",
    "asc"
  );

  const provider = storageConfig ? detectProvider(storageConfig) : "aws-s3";
  const providerInfo = getProviderInfo(provider);

  const handleStorageError = useCallback(
    (err: unknown): boolean => {
      if (err instanceof StorageApiError && err.isAuthError) {
        clearStorageConfig();
        toast.error(err.message);
        router.replace("/");
        return true;
      }
      return false;
    },
    [router]
  );

  const updateUrl = useCallback(
    (path: string) => {
      const param = pathToUrlParam(path);
      const url = param
        ? `/s3?path=${encodeURIComponent(param)}`
        : "/s3";
      router.replace(url, { scroll: false });
    },
    [router]
  );

  const fetchAndCache = useCallback(
    async (path: string, config: StorageConfig) => {
      const data = await fetchObjects(config, path || undefined);
      setFolderCache((prev) => {
        const next = new Map(prev);
        next.set(path, data);
        return next;
      });
      return data;
    },
    []
  );

  const refreshCurrentFolder = useCallback(async () => {
    if (!storageConfig) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAndCache(currentPath, storageConfig);
      setCurrentData(data);
      setConnectionStatus("connected");
    } catch (err) {
      if (handleStorageError(err)) return;
      console.error("Error fetching folder:", err);
      setError(getExplorerErrorMessage(err));
      setConnectionStatus("error");
    } finally {
      setIsLoading(false);
    }
  }, [storageConfig, currentPath, fetchAndCache, handleStorageError]);

  const refreshFolder = useCallback(
    async (path: string) => {
      if (!storageConfig) return null;
      try {
        const data = await fetchAndCache(path, storageConfig);
        if (path === currentPath) {
          setCurrentData(data);
        }
        return data;
      } catch (err) {
        if (handleStorageError(err)) return null;
        console.error("Error refreshing folder:", err);
        if (path === currentPath) {
          setError(getExplorerErrorMessage(err));
          setConnectionStatus("error");
        }
        return null;
      }
    },
    [storageConfig, currentPath, fetchAndCache, handleStorageError]
  );

  const invalidateFolder = useCallback((path: string) => {
    setFolderCache((prev) => {
      const next = new Map(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const loadFolderChildren = useCallback(
    async (path: string) => {
      if (!storageConfig) throw new Error("No storage config");
      const cached = folderCache.get(path);
      if (cached) return cached;
      const data = await fetchAndCache(path, storageConfig);
      return data;
    },
    [storageConfig, folderCache, fetchAndCache]
  );

  const navigateTo = useCallback(
    (path: string) => {
      const normalized = path.endsWith("/") || path === "" ? path : `${path}/`;
      setCurrentPath(normalized);
      setSelectedKeys(new Set());
      setSearchQuery("");
      setExpandedFolders((prev) => {
        const next = new Set(prev);
        for (const ancestor of getAncestorPaths(normalized)) {
          next.add(ancestor);
        }
        return next;
      });
      updateUrl(normalized);

      if (storageConfig) {
        const cached = folderCache.get(normalized);
        if (cached) {
          setCurrentData(cached);
          setIsLoading(false);
        } else {
          setIsLoading(true);
          fetchAndCache(normalized, storageConfig)
            .then((data) => {
              setCurrentData(data);
              setConnectionStatus("connected");
              setError(null);
            })
            .catch((err) => {
              if (handleStorageError(err)) return;
              console.error(err);
              setError(getExplorerErrorMessage(err));
              setConnectionStatus("error");
            })
            .finally(() => setIsLoading(false));
        }
      }
    },
    [storageConfig, folderCache, fetchAndCache, updateUrl, handleStorageError]
  );

  useEffect(() => {
    const config = getStorageConfigFromLocalStorage();
    if (!config) {
      router.replace("/");
      return;
    }
    setStorageConfig(config);

    const urlPath = pathFromUrlParam(searchParams.get("path"));
    setCurrentPath(urlPath);

    setIsLoading(true);
    fetchAndCache(urlPath, config)
      .then((data) => {
        setCurrentData(data);
        setConnectionStatus("connected");
      })
      .catch((err) => {
        if (!handleStorageError(err)) {
          console.error(err);
          toast.error(getExplorerErrorMessage(err));
          setError(getExplorerErrorMessage(err));
          setConnectionStatus("error");
        }
      })
      .finally(() => {
        setIsLoading(false);
        initializedRef.current = true;
      });
  }, [router, searchParams, fetchAndCache, handleStorageError]);

  useEffect(() => {
    if (!initializedRef.current || !storageConfig) return;
    const urlPath = pathFromUrlParam(searchParams.get("path"));
    if (urlPath !== currentPath) {
      setCurrentPath(urlPath);
      setSelectedKeys(new Set());
      const cached = folderCache.get(urlPath);
      if (cached) {
        setCurrentData(cached);
      } else {
        setIsLoading(true);
        fetchAndCache(urlPath, storageConfig)
          .then((data) => {
            setCurrentData(data);
            setConnectionStatus("connected");
          })
          .catch((err) => {
            if (!handleStorageError(err)) {
              setError(getExplorerErrorMessage(err));
              setConnectionStatus("error");
            }
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [
    searchParams,
    storageConfig,
    folderCache,
    fetchAndCache,
    currentPath,
    handleStorageError,
  ]);

  const toggleSelection = useCallback((key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const selectAll = useCallback((keys: string[]) => {
    setSelectedKeys(new Set(keys));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  const toggleExpanded = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const handleSignOut = useCallback(() => {
    clearStorageConfig();
    router.replace("/");
    toast("Signed out successfully!");
  }, [router]);

  const value = useMemo(
    () => ({
      storageConfig,
      provider,
      providerInfo,
      currentPath,
      selectedKeys,
      expandedFolders,
      viewMode,
      sortField,
      sortDirection,
      searchQuery,
      detailsItem,
      previewItem,
      connectionStatus,
      folderCache,
      currentData,
      isLoading,
      error,
      uploadOpen,
      newFolderOpen,
      commandOpen,
      navigateTo,
      refreshCurrentFolder,
      refreshFolder,
      invalidateFolder,
      toggleSelection,
      selectAll,
      clearSelection,
      setSelectedKeys,
      toggleExpanded,
      setViewMode,
      setSortField,
      setSortDirection,
      setSearchQuery,
      setDetailsItem,
      setPreviewItem,
      setUploadOpen,
      setNewFolderOpen,
      setCommandOpen,
      handleSignOut,
      loadFolderChildren,
    }),
    [
      storageConfig,
      provider,
      providerInfo,
      currentPath,
      selectedKeys,
      expandedFolders,
      viewMode,
      sortField,
      sortDirection,
      searchQuery,
      detailsItem,
      previewItem,
      connectionStatus,
      folderCache,
      currentData,
      isLoading,
      error,
      uploadOpen,
      newFolderOpen,
      commandOpen,
      navigateTo,
      refreshCurrentFolder,
      refreshFolder,
      invalidateFolder,
      toggleSelection,
      selectAll,
      clearSelection,
      toggleExpanded,
      setViewMode,
      setSortField,
      setSortDirection,
      handleSignOut,
      loadFolderChildren,
    ]
  );

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
}

export function useExplorer() {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error("useExplorer must be used within ExplorerProvider");
  }
  return context;
}
