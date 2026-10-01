"use client";

import { useEffect } from "react";
import { useExplorer } from "@/components/file-explorer/explorer-context";
import { useExplorerItems } from "@/hooks/use-explorer-items";
import { useSidebar } from "@/components/ui/sidebar";

export function useKeyboardShortcuts(options?: {
  onDeleteSelected?: () => void;
}) {
  const {
    setCommandOpen,
    commandOpen,
    clearSelection,
    selectedKeys,
    navigateTo,
    setPreviewItem,
  } = useExplorer();

  const { items } = useExplorerItems();
  const { toggleSidebar } = useSidebar();
  const onDeleteSelected = options?.onDeleteSelected;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      if (e.key === "Escape") {
        clearSelection();
        setCommandOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === "Enter" && selectedKeys.size === 1) {
        const key = Array.from(selectedKeys)[0];
        const item = items.find((i) => i.key === key);
        if (item?.type === "folder") {
          navigateTo(key);
        } else if (item) {
          setPreviewItem(item);
        }
      }

      if (e.key === "Delete" && selectedKeys.size > 0) {
        e.preventDefault();
        onDeleteSelected?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    commandOpen,
    setCommandOpen,
    toggleSidebar,
    clearSelection,
    selectedKeys,
    navigateTo,
    setPreviewItem,
    items,
    onDeleteSelected,
  ]);
}
