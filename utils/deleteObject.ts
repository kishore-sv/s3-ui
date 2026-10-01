import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/s3Client";
import type { StorageConfig } from "@/utils/storageConfig";

export async function deleteObject(
  key: string,
  config: StorageConfig
): Promise<void> {
  const s3 = getS3Client(config);
  await s3.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })
  );
}
