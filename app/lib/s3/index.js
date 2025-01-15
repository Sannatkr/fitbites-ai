import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export async function uploadToS3(file, fileName) {
  const arrayBuffer = await file.arrayBuffer(); // Convert the File object to ArrayBuffer
  const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer, // Use the converted Buffer here
    ContentType: file.type,
  });

  await s3Client.send(command);

  const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
  // console.log(`Path is ${fileUrl}`);
  return fileUrl;
}
