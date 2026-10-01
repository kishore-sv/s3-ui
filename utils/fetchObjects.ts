import type { ObjectsResponse } from "@/types/explorer";
import { type StorageConfig } from "@/utils/storageConfig";
import {
  StorageApiError,
  parseStorageError,
  type StorageErrorKind,
} from "@/utils/storageErrors";

type ApiErrorBody = {
  error?: string;
  code?: string;
  kind?: string;
};

export async function fetchObjects(
  config: StorageConfig,
  prefix?: string
): Promise<ObjectsResponse> {
  const url = prefix
    ? `/api/objects?prefix=${encodeURIComponent(prefix)}`
    : "/api/objects";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    let body: ApiErrorBody = {};
    try {
      body = await res.json();
    } catch {
      // ignore parse errors
    }

    const parsed = parseStorageError({
      name: body.code,
      Code: body.code,
      message: body.error,
    });

    const kind: StorageErrorKind =
      body.kind === "auth" ||
      body.kind === "access_denied" ||
      body.kind === "not_found"
        ? body.kind
        : res.status === 401
          ? "auth"
          : res.status === 403
            ? "access_denied"
            : res.status === 404
              ? "not_found"
              : parsed.kind;

    throw new StorageApiError({
      kind,
      status: res.status,
      code: body.code ?? parsed.code,
      message: body.error ?? parsed.message,
    });
  }

  return res.json();
}
