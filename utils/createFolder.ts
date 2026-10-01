import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/s3Client";
import { type StorageConfig } from "@/utils/storageConfig";

export function buildFolderKey(
  folderName: string,
  parentPrefix = ""
): string {
  const sanitized = folderName.trim().replace(/\/+$/, "").replace(/\//g, "");
  if (!sanitized) {
    throw new Error("Folder name is required");
  }

  const prefix =
    parentPrefix === ""
      ? ""
      : parentPrefix.endsWith("/")
        ? parentPrefix
        : `${parentPrefix}/`;

  return `${prefix}${sanitized}/`;
}

export async function createFolder(
  folderName: string,
  parentPrefix: string,
  config: StorageConfig
): Promise<string> {
  const key = buildFolderKey(folderName, parentPrefix);

  const s3 = getS3Client(config);
  await s3.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: "",
    })
  );

  return key;
}
