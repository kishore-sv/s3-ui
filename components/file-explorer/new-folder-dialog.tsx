"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFolder } from "@/utils/createFolder";
import { useExplorer } from "./explorer-context";

export function NewFolderDialog({
  parentPathOverride,
}: {
  parentPathOverride?: string;
}) {
  const {
    newFolderOpen,
    setNewFolderOpen,
    storageConfig,
    currentPath,
    refreshCurrentFolder,
    invalidateFolder,
  } = useExplorer();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const effectiveParent = parentPathOverride ?? currentPath;

  const handleCreate = async () => {
    if (!storageConfig) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Folder name is required");
      return;
    }
    if (trimmed.includes("/")) {
      setError("Folder name cannot contain slashes");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      await createFolder(trimmed, effectiveParent, storageConfig);
      toast.success(`"${trimmed}" was created successfully`);
      invalidateFolder(effectiveParent);
      await refreshCurrentFolder();
      setName("");
      setNewFolderOpen(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't create the folder";
      setError(message);
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isCreating) {
      setNewFolderOpen(open);
      if (!open) {
        setName("");
        setError("");
      }
    }
  };

  return (
    <Dialog open={newFolderOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create folder</DialogTitle>
          <DialogDescription>
            Create a new folder in the current location.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="folder-name">Folder name</Label>
          <Input
            id="folder-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="documents"
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button onClick={() => void handleCreate()} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Folder"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
