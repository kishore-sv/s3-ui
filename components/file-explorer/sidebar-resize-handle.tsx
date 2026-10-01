"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { useResizableSidebarContext } from "@/hooks/use-resizable-sidebar";

export function SidebarResizeHandle() {
  const { state, isMobile, open } = useSidebar();
  const { onResizeStart, isResizing, resetWidth } =
    useResizableSidebarContext();

  if (isMobile || !open || state === "collapsed") {
    return null;
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      onMouseDown={onResizeStart}
      onDoubleClick={resetWidth}
      className={cn(
        "absolute top-0 -right-1 z-30 h-full w-2 cursor-col-resize",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent",
        "hover:after:bg-border active:after:bg-border",
        isResizing && "after:bg-primary/60"
      )}
      title="Drag to resize sidebar (double-click to reset)"
    />
  );
}
