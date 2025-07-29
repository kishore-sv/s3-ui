import { getS3Client } from "@/uitils/s3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const { region, accessKeyId, secretAccessKey,bucketName } = await request.json();

    const s3 = getS3Client({
        region,
        accessKeyId,
        secretAccessKey,
    });

    const prefix = request.nextUrl.searchParams.get('prefix') ?? undefined

    const command = new ListObjectsV2Command({
        Bucket:bucketName,
        Delimiter: "/",
        Prefix: prefix,
    });

    const result = await s3.send(command);

    const rootFiles =
        result.Contents?.map((e) => ({
            Key: e.Key,
            Size: e.Size,
            LastModified: e.LastModified,
        })) || [];

    const rootFolders = result.CommonPrefixes?.map((e) => e.Prefix) || [];

    return NextResponse.json({ files: rootFiles, folders: rootFolders });
}
