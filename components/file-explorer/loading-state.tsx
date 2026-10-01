"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TableLoadingState({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1 max-w-[200px]" />
          <Skeleton className="h-4 w-16 hidden md:block" />
          <Skeleton className="h-4 w-16 hidden md:block" />
          <Skeleton className="h-4 w-24 hidden lg:block" />
        </div>
      ))}
    </div>
  );
}

export function SidebarLoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 px-2 py-1">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-7 rounded"
          style={{ marginLeft: `${(i % 2) * 12}px` }}
        />
      ))}
    </div>
  );
}
