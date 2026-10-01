"use client";

import { FolderOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExplorer } from "./explorer-context";

export function EmptyState({ isRoot }: { isRoot: boolean }) {
  const { setUploadOpen, setNewFolderOpen } = useExplorer();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FolderOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {isRoot ? "Your bucket is empty" : "This folder is empty"}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {isRoot
          ? "Upload your first file or create a folder to get started."
          : "Upload files or create a folder to get started."}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
        <Button variant="outline" onClick={() => setNewFolderOpen(true)}>
          New Folder
        </Button>
      </div>
    </div>
  );
}
