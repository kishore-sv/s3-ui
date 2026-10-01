"use client";

import { Suspense } from "react";
import { ExplorerProvider } from "@/components/file-explorer/explorer-context";
import { FileExplorer } from "@/components/file-explorer/file-explorer";

export type { ObjectsResponse, S3Object } from "@/types/explorer";

function S3PageContent() {
  return (
    <ExplorerProvider>
      <FileExplorer />
    </ExplorerProvider>
  );
}

export default function S3Page() {
  return (
    <Suspense>
      <S3PageContent />
    </Suspense>
  );
}
