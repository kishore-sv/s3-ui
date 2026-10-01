export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const timeStr = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (dateOnly.getTime() === today.getTime()) {
    return `Today, ${timeStr}`;
  }
  if (dateOnly.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeStr}`;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (dateOnly.getTime() === today.getTime()) return "Today";
  if (dateOnly.getTime() === yesterday.getTime()) return "Yesterday";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const EXTENSION_TYPE_MAP: Record<string, string> = {
  pdf: "PDF",
  doc: "Word",
  docx: "Word",
  xls: "Spreadsheet",
  xlsx: "Spreadsheet",
  csv: "CSV",
  txt: "Text",
  md: "Markdown",
  json: "JSON",
  xml: "XML",
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
  ts: "TypeScript",
  jsx: "JSX",
  tsx: "TSX",
  py: "Python",
  rb: "Ruby",
  go: "Go",
  rs: "Rust",
  java: "Java",
  png: "Image",
  jpg: "Image",
  jpeg: "Image",
  gif: "Image",
  webp: "Image",
  svg: "Image",
  ico: "Image",
  mp4: "Video",
  webm: "Video",
  mov: "Video",
  avi: "Video",
  mp3: "Audio",
  wav: "Audio",
  flac: "Audio",
  zip: "Archive",
  rar: "Archive",
  tar: "Archive",
  gz: "Archive",
  "7z": "Archive",
};

export function getFileExtension(name: string): string {
  const parts = name.split(".");
  if (parts.length < 2) return "";
  return parts.pop()?.toLowerCase() ?? "";
}

export function getFileTypeLabel(name: string): string {
  const ext = getFileExtension(name);
  return EXTENSION_TYPE_MAP[ext] ?? (ext ? ext.toUpperCase() : "File");
}

export function normalizePath(path: string): string {
  if (!path) return "";
  return path.endsWith("/") ? path : `${path}/`;
}

export function getDisplayName(key: string): string {
  const trimmed = key.replace(/\/$/, "");
  const parts = trimmed.split("/");
  return parts[parts.length - 1] || key;
}

export function getParentPath(path: string): string {
  const parts = path.replace(/\/$/, "").split("/").filter(Boolean);
  parts.pop();
  return parts.length ? `${parts.join("/")}/` : "";
}

export function buildPathFromSegments(segments: string[]): string {
  if (segments.length === 0) return "";
  return `${segments.join("/")}/`;
}
