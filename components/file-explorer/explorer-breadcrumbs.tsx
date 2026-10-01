"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useExplorer } from "./explorer-context";
import { buildPathFromSegments } from "@/utils/formatExplorer";

export function ExplorerBreadcrumbs() {
  const { currentPath, navigateTo } = useExplorer();
  const segments = currentPath.split("/").filter(Boolean);

  const buildCollapsed = () => {
    if (segments.length <= 3) return null;
    const first = segments[0];
    const last = segments[segments.length - 1];
    const parent = segments[segments.length - 2];
    return { first, parent, last, middleCount: segments.length - 3 };
  };

  const collapsed = buildCollapsed();

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              Home
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  if (collapsed) {
    const parentPath = buildPathFromSegments(
      segments.slice(0, segments.length - 1)
    );
    const firstPath = buildPathFromSegments([collapsed.first]);

    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer flex items-center gap-1"
              onClick={() => navigateTo("")}
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => navigateTo(firstPath)}
            >
              {collapsed.first}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => navigateTo(parentPath)}
            >
              {collapsed.parent}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{collapsed.last}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            className="cursor-pointer flex items-center gap-1"
            onClick={() => navigateTo("")}
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const path = buildPathFromSegments(segments.slice(0, index + 1));
          const isLast = index === segments.length - 1;

          return (
            <span key={path} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => navigateTo(path)}
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
