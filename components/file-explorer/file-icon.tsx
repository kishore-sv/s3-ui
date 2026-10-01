import {
  Archive,
  File,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
} from "lucide-react";
import { getFileExtension } from "@/utils/formatExplorer";
import { cn } from "@/lib/utils";

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"]);
const VIDEO_EXTS = new Set(["mp4", "webm", "mov", "avi", "mkv"]);
const AUDIO_EXTS = new Set(["mp3", "wav", "flac", "ogg", "aac"]);
const CODE_EXTS = new Set([
  "js", "ts", "jsx", "tsx", "py", "rb", "go", "rs", "java", "css", "html",
  "json", "xml", "yaml", "yml", "sh", "sql",
]);
const ARCHIVE_EXTS = new Set(["zip", "rar", "tar", "gz", "7z", "bz2"]);
const SPREADSHEET_EXTS = new Set(["xls", "xlsx", "csv"]);
const DOC_EXTS = new Set(["pdf", "doc", "docx", "txt", "md", "rtf"]);

export function FileIcon({
  name,
  type,
  isOpen,
  className,
}: {
  name: string;
  type: "file" | "folder";
  isOpen?: boolean;
  className?: string;
}) {
  const iconClass = cn("h-4 w-4 shrink-0", className);

  if (type === "folder") {
    return isOpen ? (
      <FolderOpen className={cn(iconClass, "text-amber-500")} />
    ) : (
      <Folder className={cn(iconClass, "text-amber-500")} />
    );
  }

  const ext = getFileExtension(name);

  if (ext === "pdf" || DOC_EXTS.has(ext)) {
    return <FileText className={cn(iconClass, "text-blue-500")} />;
  }
  if (IMAGE_EXTS.has(ext)) {
    return <FileImage className={cn(iconClass, "text-emerald-500")} />;
  }
  if (VIDEO_EXTS.has(ext)) {
    return <FileVideo className={cn(iconClass, "text-purple-500")} />;
  }
  if (AUDIO_EXTS.has(ext)) {
    return <FileAudio className={cn(iconClass, "text-pink-500")} />;
  }
  if (CODE_EXTS.has(ext)) {
    return <FileCode className={cn(iconClass, "text-orange-500")} />;
  }
  if (ARCHIVE_EXTS.has(ext)) {
    return <Archive className={cn(iconClass, "text-yellow-600")} />;
  }
  if (SPREADSHEET_EXTS.has(ext)) {
    return <FileSpreadsheet className={cn(iconClass, "text-green-600")} />;
  }

  return <File className={cn(iconClass, "text-muted-foreground")} />;
}
