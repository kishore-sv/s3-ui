"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  formatBytes,
  formatDate,
  getFileTypeLabel,
} from "@/utils/formatExplorer";
import { useExplorer } from "./explorer-context";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm break-all">{value}</span>
    </div>
  );
}

export function FileDetailsSheet() {
  const { detailsItem, setDetailsItem, providerInfo } = useExplorer();

  if (!detailsItem) return null;

  const location = detailsItem.parentPath
    ? `/${detailsItem.parentPath.replace(/\/$/, "")}/`
    : "/";

  return (
    <Sheet
      open={!!detailsItem}
      onOpenChange={(open) => !open && setDetailsItem(null)}
    >
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 border-b px-6 pt-6 pb-4">
          <SheetTitle className="truncate pr-8">{detailsItem.name}</SheetTitle>
          <SheetDescription>
            {detailsItem.type === "folder" ? "Folder" : "File"} details
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <DetailRow
            label="Type"
            value={
              detailsItem.type === "folder"
                ? "Folder"
                : getFileTypeLabel(detailsItem.name)
            }
          />
          {detailsItem.type === "file" && detailsItem.size !== undefined && (
            <DetailRow label="Size" value={formatBytes(detailsItem.size)} />
          )}
          <DetailRow label="Location" value={location} />
          {detailsItem.lastModified && (
            <DetailRow
              label="Modified"
              value={formatDate(detailsItem.lastModified)}
            />
          )}
          <Separator />
          <DetailRow label="Object key" value={detailsItem.key} />
          <DetailRow label="Provider" value={providerInfo.name} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
