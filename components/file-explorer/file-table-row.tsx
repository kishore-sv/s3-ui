"use client";

import type { ExplorerItem } from "@/types/explorer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  formatBytes,
  formatDateShort,
  getFileTypeLabel,
} from "@/utils/formatExplorer";
import { FileIcon } from "./file-icon";
import { FileActionMenu, FileContextMenuItems } from "./file-actions";
import { useExplorer } from "./explorer-context";
import { useFileActions } from "./file-actions";

export function FileTableRow({
  item,
  onDelete,
}: {
  item: ExplorerItem;
  onDelete: (item: ExplorerItem) => void;
}) {
  const { selectedKeys, toggleSelection, currentPath } = useExplorer();
  const { openItem } = useFileActions();
  const isSelected = selectedKeys.has(item.key);

  const handleDoubleClick = () => {
    openItem(item);
  };

  const handleClick = () => {
    toggleSelection(item.key);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow
          className={cn(
            "cursor-pointer group",
            isSelected && "bg-accent/50"
          )}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        >
          <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleSelection(item.key)}
              aria-label={`Select ${item.name}`}
            />
          </TableCell>
          <TableCell className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <FileIcon
                name={item.name}
                type={item.type}
                isOpen={item.type === "folder" && currentPath === item.path}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate max-w-[200px] sm:max-w-[300px] lg:max-w-[400px]">
                    {item.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{item.key}</TooltipContent>
              </Tooltip>
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell text-muted-foreground">
            {item.type === "folder" ? "Folder" : getFileTypeLabel(item.name)}
          </TableCell>
          <TableCell className="hidden md:table-cell text-muted-foreground">
            {item.type === "folder"
              ? "-"
              : item.size !== undefined
                ? formatBytes(item.size)
                : "-"}
          </TableCell>
          <TableCell className="hidden lg:table-cell text-muted-foreground">
            {item.lastModified
              ? formatDateShort(item.lastModified)
              : "-"}
          </TableCell>
          <TableCell
            className="w-10"
            onClick={(e) => e.stopPropagation()}
          >
            <FileActionMenu item={item} onDelete={onDelete} />
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <FileContextMenuItems item={item} onDelete={onDelete} />
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function FileMobileRow({
  item,
  onDelete,
}: {
  item: ExplorerItem;
  onDelete: (item: ExplorerItem) => void;
}) {
  const { selectedKeys, toggleSelection } = useExplorer();
  const { openItem } = useFileActions();
  const isSelected = selectedKeys.has(item.key);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 border-b cursor-pointer",
        isSelected && "bg-accent/50"
      )}
      onClick={() => toggleSelection(item.key)}
      onDoubleClick={() => openItem(item)}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => toggleSelection(item.key)}
        onClick={(e) => e.stopPropagation()}
        className="mt-1"
      />
      <FileIcon name={item.name} type={item.type} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          {item.type === "folder"
            ? "Folder"
            : `${getFileTypeLabel(item.name)} · ${item.size !== undefined ? formatBytes(item.size) : "-"}`}
        </p>
        {item.lastModified && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDateShort(item.lastModified)}
          </p>
        )}
      </div>
      <FileActionMenu item={item} onDelete={onDelete} />
    </div>
  );
}
