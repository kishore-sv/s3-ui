import type { ExplorerItem, ObjectsResponse } from "@/types/explorer";
import { getDisplayName } from "@/utils/formatExplorer";

export function mapObjectsToExplorerItems(
  data: ObjectsResponse,
  parentPath: string
): ExplorerItem[] {
  const folders: ExplorerItem[] = (data.folders ?? []).map((prefix) => ({
    key: prefix,
    name: getDisplayName(prefix),
    type: "folder" as const,
    path: prefix,
    parentPath,
  }));

  const files: ExplorerItem[] = (data.files ?? [])
    .filter((file) => {
      if (!file.Key) return false;
      // Filter out folder marker objects (zero-byte keys ending with /)
      if (file.Key.endsWith("/") && (file.Size === 0 || file.Size === undefined))
        return false;
      // Filter out key that equals parent prefix
      if (file.Key === parentPath) return false;
      return true;
    })
    .map((file) => ({
      key: file.Key!,
      name: getDisplayName(file.Key!),
      type: "file" as const,
      size: file.Size,
      lastModified: file.LastModified,
      path: file.Key!,
      parentPath,
    }));

  return [...folders, ...files];
}
