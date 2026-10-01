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
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="truncate">{detailsItem.name}</SheetTitle>
          <SheetDescription>
            {detailsItem.type === "folder" ? "Folder" : "File"} details
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
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
