import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/s3Client";
import type { StorageConfig } from "@/utils/storageConfig";

export type FolderContentsCount = {
  count: number;
  isTruncated: boolean;
};

export async function countFolderContents(
  folderPrefix: string,
  config: StorageConfig
): Promise<FolderContentsCount> {
  const s3 = getS3Client(config);
  const prefix = folderPrefix.endsWith("/")
    ? folderPrefix
    : `${folderPrefix}/`;

  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: prefix,
      MaxKeys: 1000,
    })
  );

  const contents = result.Contents ?? [];
  // Exclude the folder marker object itself
  const count = contents.filter((obj) => obj.Key !== prefix).length;

  return {
    count,
    isTruncated: result.IsTruncated ?? false,
  };
}
