import { S3Client } from "@aws-sdk/client-s3";
import {
  shouldUsePathStyle,
  type StorageConfig,
} from "@/utils/storageConfig";

export function getS3Client({
  region,
  accessKeyId,
  secretAccessKey,
  endpoint,
  bucketName,
}: StorageConfig) {
  const config: StorageConfig = {
    region,
    accessKeyId,
    secretAccessKey,
    bucketName,
    endpoint,
  };

  const clientConfig: ConstructorParameters<typeof S3Client>[0] = {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  };

  if (endpoint?.trim()) {
    clientConfig.endpoint = endpoint.trim();
    clientConfig.forcePathStyle = shouldUsePathStyle(config);
  }

  return new S3Client(clientConfig);
}
