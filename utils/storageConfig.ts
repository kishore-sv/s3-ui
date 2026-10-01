import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "@/utils/s3Client";

export type StorageProvider =
  | "aws-s3"
  | "minio"
  | "cloudflare-r2"
  | "supabase"
  | "s3-compatible";

export interface StorageConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint?: string;
}

export interface ProviderInfo {
  id: StorageProvider;
  name: string;
  shortName: string;
  bucketLabel: string;
  color: string;
  logo: string;
  description: string;
  includes?: string[];
  invertInDarkMode?: boolean;
}

const PROVIDER_INFO: Record<StorageProvider, ProviderInfo> = {
  "aws-s3": {
    id: "aws-s3",
    name: "Amazon S3",
    shortName: "S3",
    bucketLabel: "S3 Bucket",
    color: "#569A31",
    logo: "/providers/aws-s3.svg",
    description: "Native AWS object storage. Leave endpoint empty to connect.",
    invertInDarkMode: false,
  },
  minio: {
    id: "minio",
    name: "MinIO",
    shortName: "MinIO",
    bucketLabel: "MinIO Bucket",
    color: "#C72C2C",
    logo: "/providers/minio.svg",
    description: "Self-hosted, Kubernetes-native object storage.",
    invertInDarkMode: true,
  },
  "cloudflare-r2": {
    id: "cloudflare-r2",
    name: "Cloudflare R2",
    shortName: "R2",
    bucketLabel: "R2 Bucket",
    color: "#F6821F",
    logo: "/providers/cloudflare-r2.svg",
    description: "Zero egress fee object storage on Cloudflare.",
    invertInDarkMode: true,
  },
  supabase: {
    id: "supabase",
    name: "Supabase Storage",
    shortName: "Supabase",
    bucketLabel: "Supabase Bucket",
    color: "#3ECF8E",
    logo: "/providers/supabase.svg",
    description: "S3-compatible storage built into Supabase projects.",
    invertInDarkMode: true,
  },
  "s3-compatible": {
    id: "s3-compatible",
    name: "S3-Compatible Storage",
    shortName: "S3",
    bucketLabel: "Storage Bucket",
    color: "#2563EB",
    logo: "/providers/s3-compatible.svg",
    description: "Any provider with an S3-compatible API endpoint.",
    includes: [
      "/providers/s3-compatible.svg",
      "/providers/backblaze.svg",
      "/providers/wasabi.svg",
    ],
    invertInDarkMode: true,
  },
};

export const SUPPORTED_PROVIDERS: StorageProvider[] = [
  "aws-s3",
  "minio",
  "cloudflare-r2",
  "supabase",
  "s3-compatible",
];

export function detectProvider(config: StorageConfig): StorageProvider {
  const endpoint = config.endpoint?.trim().toLowerCase() ?? "";

  if (!endpoint) {
    return "aws-s3";
  }

  if (endpoint.includes("r2.cloudflarestorage.com")) {
    return "cloudflare-r2";
  }

  if (endpoint.includes("supabase.co")) {
    return "supabase";
  }

  if (
    endpoint.includes("localhost") ||
    endpoint.includes("127.0.0.1") ||
    endpoint.includes("minio")
  ) {
    return "minio";
  }

  return "s3-compatible";
}

export function getProviderInfo(provider: StorageProvider): ProviderInfo {
  return PROVIDER_INFO[provider];
}

export function shouldUsePathStyle(config: StorageConfig): boolean {
  const provider = detectProvider(config);
  return provider !== "aws-s3";
}

export function getStorageConfigFromLocalStorage(): StorageConfig | null {
  if (typeof window === "undefined") return null;

  const region = localStorage.getItem("region");
  const accessKeyId = localStorage.getItem("accessKey");
  const secretAccessKey = localStorage.getItem("secrectAccessKey");
  const bucketName = localStorage.getItem("bucketName");
  const endpoint = localStorage.getItem("endpoint") ?? undefined;

  if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  return {
    region,
    accessKeyId,
    secretAccessKey,
    bucketName,
    endpoint: endpoint || undefined,
  };
}

export function saveStorageConfigToLocalStorage(config: StorageConfig): void {
  localStorage.setItem("bucketName", config.bucketName);
  localStorage.setItem("accessKey", config.accessKeyId);
  localStorage.setItem("secrectAccessKey", config.secretAccessKey);
  localStorage.setItem("region", config.region);

  if (config.endpoint?.trim()) {
    localStorage.setItem("endpoint", config.endpoint.trim());
  } else {
    localStorage.removeItem("endpoint");
  }

  const provider = detectProvider(config);
  localStorage.setItem("storageProvider", provider);
}

export function clearStorageConfig(): void {
  localStorage.removeItem("region");
  localStorage.removeItem("accessKey");
  localStorage.removeItem("secrectAccessKey");
  localStorage.removeItem("bucketName");
  localStorage.removeItem("endpoint");
  localStorage.removeItem("storageProvider");
}

export function getPublicObjectUrl(
  config: StorageConfig,
  key: string
): string {
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const provider = detectProvider(config);

  if (provider === "aws-s3") {
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${encodedKey}`;
  }

  const endpoint = config.endpoint!.replace(/\/$/, "");
  return `${endpoint}/${config.bucketName}/${encodedKey}`;
}

export async function getPresignedObjectUrl(
  config: StorageConfig,
  key: string
): Promise<string> {
  const s3 = getS3Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
