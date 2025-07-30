import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/s3Client";

 export const  deleteFolder = async (folderPrefix: string, s3Keys: any) => {
  const s3 = getS3Client(s3Keys);

  const listCommand = new ListObjectsV2Command({
    Bucket: s3Keys.bucketName,
    Prefix: folderPrefix,
  });

  const listedObjects = await s3.send(listCommand);

  if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

  const objectsToDelete = listedObjects.Contents.map(obj => ({ Key: obj.Key }));

  const deleteCommand = new DeleteObjectsCommand({
    Bucket: s3Keys.bucketName,
    Delete: {
      Objects: objectsToDelete,
      Quiet: false,
    },
  });

  await s3.send(deleteCommand);
  console.log(`✅ Deleted folder: ${folderPrefix}`);
};
