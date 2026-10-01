import {
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/s3Client";
import { type StorageConfig } from "@/utils/storageConfig";

export const deleteFolder = async (
  folderPrefix: string,
  s3Keys: StorageConfig
) => {
  const s3 = getS3Client(s3Keys);
  const prefix = folderPrefix.endsWith("/")
    ? folderPrefix
    : `${folderPrefix}/`;

  let continuationToken: string | undefined;

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: s3Keys.bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const listedObjects = await s3.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      continuationToken = listedObjects.NextContinuationToken;
      continue;
    }

    const objectsToDelete = listedObjects.Contents.map((obj) => ({
      Key: obj.Key,
    }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: s3Keys.bucketName,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false,
      },
    });

    await s3.send(deleteCommand);
    continuationToken = listedObjects.NextContinuationToken;
  } while (continuationToken);
};
