"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

const STORAGE_KEY = "explorer-sidebar-width";
const DEFAULT_WIDTH = 256;
const MIN_WIDTH = 200;
const MAX_WIDTH_RATIO = 0.4;

function clampWidth(width: number): number {
  const max = Math.floor(window.innerWidth * MAX_WIDTH_RATIO);
  return Math.min(Math.max(width, MIN_WIDTH), max);
}

type ResizableSidebarContextValue = {
  width: number;
  isResizing: boolean;
  onResizeStart: (event: ReactMouseEvent) => void;
  resetWidth: () => void;
};

const ResizableSidebarContext =
  createContext<ResizableSidebarContextValue | null>(null);

export function useResizableSidebarContext() {
  const context = useContext(ResizableSidebarContext);
  if (!context) {
    throw new Error(
      "useResizableSidebarContext must be used within ResizableSidebarProvider"
    );
  }
  return context;
}

function useResizableSidebarState() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const widthRef = useRef(width);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = Number.parseInt(stored, 10);
        if (!Number.isNaN(parsed)) {
          setWidth(clampWidth(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWidth((current) => clampWidth(current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetWidth = useCallback(() => {
    setWidth(DEFAULT_WIDTH);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const onResizeStart = useCallback((event: ReactMouseEvent) => {
    event.preventDefault();
    setIsResizing(true);

    const startX = event.clientX;
    const startWidth = widthRef.current;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = clampWidth(startWidth + moveEvent.clientX - startX);
      widthRef.current = nextWidth;
      setWidth(nextWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      try {
        localStorage.setItem(STORAGE_KEY, String(widthRef.current));
      } catch {
        // ignore
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  return { width, isResizing, onResizeStart, resetWidth };
}

export function ResizableSidebarProvider({ children }: { children: ReactNode }) {
  const { width, isResizing, onResizeStart, resetWidth } =
    useResizableSidebarState();

  return (
    <ResizableSidebarContext.Provider
      value={{ width, isResizing, onResizeStart, resetWidth }}
    >
      <SidebarProvider
        style={{ "--sidebar-width": `${width}px` } as React.CSSProperties}
        className={cn(
          isResizing &&
            "[&_[data-slot=sidebar-gap]]:transition-none [&_[data-slot=sidebar-container]]:transition-none"
        )}
      >
        {children}
      </SidebarProvider>
    </ResizableSidebarContext.Provider>
  );
}
