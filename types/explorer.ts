export type S3Object = {
  Key?: string;
  Size?: number;
  LastModified?: string;
};

export type ObjectsResponse = {
  files: S3Object[];
  folders: string[];
};

export type ExplorerItem = {
  key: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified?: string;
  path: string;
  parentPath: string;
};

export type ViewMode = "list" | "grid";

export type SortField = "name" | "type" | "size" | "modified";

export type SortDirection = "asc" | "desc";

export type ConnectionStatus = "connecting" | "connected" | "error";
