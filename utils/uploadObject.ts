import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/s3Client";
import type { StorageConfig } from "@/utils/storageConfig";

export async function uploadObject(
  file: File,
  key: string,
  config: StorageConfig,
  onProgress?: (progress: number) => void
): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  onProgress?.(50);

  const s3 = getS3Client(config);
  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  onProgress?.(100);
}

export function buildUploadKey(fileName: string, parentPrefix: string): string {
  const prefix =
    parentPrefix === ""
      ? ""
      : parentPrefix.endsWith("/")
        ? parentPrefix
        : `${parentPrefix}/`;
  return `${prefix}${fileName}`;
}
