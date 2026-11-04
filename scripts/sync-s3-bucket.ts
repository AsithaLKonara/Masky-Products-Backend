import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const s3 = new S3Client({
  endpoint: process.env.AWS_S3_ENDPOINT || 'https://t3.storageapi.dev',
  region: process.env.AWS_S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || 'tid_srOOybLxNHRbsJBXgWsRfXDtndyCQbCCwLHzqLSvBMOXGSZVhy',
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || 'tsec_2788wf4al-LDdNtYjC4QCQLgDSTu8kSuEj_c4a3wIGQUokn2ldFevNfIvY4P2qjtUq2AGS',
  },
  forcePathStyle: true,
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME || 'optimized-snackbox-qc-5cd';

function getMime(filename: string): string {
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

async function uploadFile(localPath: string, key: string) {
  const fileContent = fs.readFileSync(localPath);
  const contentType = getMime(localPath);
  
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    })
  );
  console.log(`[Uploaded] ${localPath} -> s3://${BUCKET}/${key} (${(fileContent.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log(`=== SYNCING IMAGES TO S3 BUCKET: ${BUCKET} ===`);

  const uploadsDir = path.resolve(__dirname, '../uploads/products');
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const file of files) {
      if (file.startsWith('.')) continue;
      const filePath = path.join(uploadsDir, file);
      if (fs.statSync(filePath).isFile()) {
        // Upload under both products/ and uploads/products/ and root
        await uploadFile(filePath, `products/${file}`);
        await uploadFile(filePath, `uploads/products/${file}`);
        await uploadFile(filePath, file);
      }
    }
  }

  // Also check hero images
  const heroDir = path.resolve(__dirname, '../../Frontend/public/hero-image');
  if (fs.existsSync(heroDir)) {
    const files = fs.readdirSync(heroDir);
    for (const file of files) {
      if (file.startsWith('.')) continue;
      const filePath = path.join(heroDir, file);
      if (fs.statSync(filePath).isFile()) {
        await uploadFile(filePath, `hero-image/${file}`);
      }
    }
  }

  console.log('\n=== VERIFYING OBJECTS IN S3 BUCKET ===');
  const res = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }));
  console.log(`Total objects in bucket: ${res.KeyCount}`);
  res.Contents?.forEach(obj => {
    console.log(` - ${obj.Key} (${obj.Size} bytes)`);
  });
  console.log('\n=== S3 SYNC COMPLETE ===');
}

main().catch(err => {
  console.error('Error syncing S3:', err);
  process.exit(1);
});
