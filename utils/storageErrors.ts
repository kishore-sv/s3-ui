const AUTH_ERROR_CODES = new Set([
  "SignatureDoesNotMatch",
  "InvalidAccessKeyId",
  "InvalidToken",
  "ExpiredToken",
  "TokenRefreshRequired",
  "UnrecognizedClientException",
  "InvalidClientTokenId",
  "AuthFailure",
]);

const ACCESS_DENIED_CODES = new Set(["AccessDenied", "403"]);

const NOT_FOUND_CODES = new Set([
  "NoSuchBucket",
  "NotFound",
  "NoSuchKey",
]);

export type StorageErrorKind = "auth" | "access_denied" | "not_found" | "unknown";

export type ParsedStorageError = {
  kind: StorageErrorKind;
  status: number;
  code: string;
  message: string;
};

function getErrorCode(error: unknown): string {
  if (!error || typeof error !== "object") return "UnknownError";

  const err = error as { name?: string; Code?: string; code?: string };
  return err.name ?? err.Code ?? err.code ?? "UnknownError";
}

export function parseStorageError(error: unknown): ParsedStorageError {
  const code = getErrorCode(error);

  if (AUTH_ERROR_CODES.has(code)) {
    return {
      kind: "auth",
      status: 401,
      code,
      message:
        "Invalid storage credentials. Please check your access key, secret key, and endpoint.",
    };
  }

  if (ACCESS_DENIED_CODES.has(code)) {
    return {
      kind: "access_denied",
      status: 403,
      code,
      message:
        "Access denied. Your credentials may not have permission to list this bucket.",
    };
  }

  if (NOT_FOUND_CODES.has(code)) {
    return {
      kind: "not_found",
      status: 404,
      code,
      message: "Bucket or path not found. Please verify your bucket name.",
    };
  }

  return {
    kind: "unknown",
    status: 500,
    code,
    message: "Failed to list objects. Please try again.",
  };
}

export class StorageApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly kind: StorageErrorKind;

  constructor(parsed: ParsedStorageError) {
    super(parsed.message);
    this.name = "StorageApiError";
    this.status = parsed.status;
    this.code = parsed.code;
    this.kind = parsed.kind;
  }

  get isAuthError(): boolean {
    return this.kind === "auth";
  }
}
