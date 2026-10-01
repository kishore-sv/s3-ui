"use client";

import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function UploadDropzone({
  onFilesSelected,
  disabled,
}: {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFilesSelected(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onFilesSelected(files);
    e.target.value = "";
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => {
        if (disabled) return;
        document.getElementById("upload-file-input")?.click();
      }}
    >
      <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm font-medium mb-1">Drag & drop files here</p>
      <p className="text-xs text-muted-foreground mb-4">or</p>
      <Button type="button" variant="outline" size="sm" disabled={disabled}>
        Choose Files
      </Button>
      <input
        id="upload-file-input"
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
