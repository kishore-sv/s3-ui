"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPresignedObjectUrl } from "@/utils/storageConfig";
import { getFileExtension } from "@/utils/formatExplorer";
import { useExplorer } from "./explorer-context";
import { useFileActions } from "./file-actions";

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
const TEXT_EXTS = new Set([
  "txt", "md", "json", "xml", "html", "css", "js", "ts", "jsx", "tsx",
  "py", "rb", "go", "rs", "java", "csv", "yaml", "yml", "sh", "sql",
]);

export function FilePreviewDialog() {
  const { previewItem, setPreviewItem, storageConfig } = useExplorer();
  const { downloadItem } = useFileActions();
  const [url, setUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const ext = previewItem ? getFileExtension(previewItem.name) : "";
  const isImage = IMAGE_EXTS.has(ext);
  const isText = TEXT_EXTS.has(ext);
  const isPdf = ext === "pdf";

  useEffect(() => {
    if (!previewItem || !storageConfig) {
      setUrl(null);
      setTextContent(null);
      return;
    }

    setIsLoading(true);
    setError(false);

    void getPresignedObjectUrl(storageConfig, previewItem.key)
      .then(async (presignedUrl) => {
        setUrl(presignedUrl);
        if (isText) {
          const res = await fetch(presignedUrl);
          const text = await res.text();
          setTextContent(text.slice(0, 50000));
        }
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [previewItem, storageConfig, isText]);

  if (!previewItem) return null;

  const canPreview = isImage || isText || isPdf;

  return (
    <Dialog
      open={!!previewItem}
      onOpenChange={(open) => !open && setPreviewItem(null)}
    >
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate">{previewItem.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Preview unavailable</p>
              <Button onClick={() => void downloadItem(previewItem)}>
                <Download className="h-4 w-4" />
                Download file
              </Button>
            </div>
          )}

          {!isLoading && !error && url && isImage && (
            <img
              src={url}
              alt={previewItem.name}
              className="max-w-full max-h-[60vh] mx-auto object-contain"
            />
          )}

          {!isLoading && !error && url && isPdf && (
            <iframe
              src={url}
              title={previewItem.name}
              className="w-full h-[60vh] border rounded"
            />
          )}

          {!isLoading && !error && textContent && isText && (
            <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-[60vh] whitespace-pre-wrap break-words">
              {textContent}
            </pre>
          )}

          {!isLoading && !error && !canPreview && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Preview unavailable</p>
              <Button onClick={() => void downloadItem(previewItem)}>
                <Download className="h-4 w-4" />
                Download file
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
