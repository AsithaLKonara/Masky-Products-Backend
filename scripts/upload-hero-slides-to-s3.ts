import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const s3 = new S3Client({
  endpoint: 'https://t3.storageapi.dev',
  region: 'auto',
  credentials: {
    accessKeyId: 'tid_srOOybLxNHRbsJBXgWsRfXDtndyCQbCCwLHzqLSvBMOXGSZVhy',
    secretAccessKey: 'tsec_2788wf4al-LDdNtYjC4QCQLgDSTu8kSuEj_c4a3wIGQUokn2ldFevNfIvY4P2qjtUq2AGS',
  },
  forcePathStyle: true,
});

const BUCKET = 'optimized-snackbox-qc-5cd';

const slideMappings = [
  {
    localFile: path.resolve(__dirname, '../../Frontend/public/hero-image/Product1.png'),
    s3Keys: [
      'Uncategorized/a3ee4206-ecb3-415d-890c-e6c056e92d53.png',
      'a3ee4206-ecb3-415d-890c-e6c056e92d53.png',
      'hero-image/Product1.png',
      'Product1.png',
    ],
  },
  {
    localFile: path.resolve(__dirname, '../../Frontend/public/hero-image/Product2.png'),
    s3Keys: [
      'Uncategorized/230d5a03-fe89-40ae-8980-aaf0ccb19282.png',
      '230d5a03-fe89-40ae-8980-aaf0ccb19282.png',
      'hero-image/Product2.png',
      'Product2.png',
    ],
  },
  {
    localFile: path.resolve(__dirname, '../../Frontend/public/hero-image/Product3.png'),
    s3Keys: [
      'Uncategorized/e4ebe542-d2e9-4d41-b425-efca15beecbb.png',
      'e4ebe542-d2e9-4d41-b425-efca15beecbb.png',
      'hero-image/Product3.png',
      'Product3.png',
    ],
  },
  {
    localFile: path.resolve(__dirname, '../../Frontend/public/hero-image/Product4.png'),
    s3Keys: [
      'Uncategorized/83e8dd66-8d48-49f8-a086-1c937c948cd7.png',
      '83e8dd66-8d48-49f8-a086-1c937c948cd7.png',
      'hero-image/Product4.png',
      'Product4.png',
    ],
  },
  {
    localFile: path.resolve(__dirname, '../../Frontend/public/hero-image/Product5.png'),
    s3Keys: [
      'Uncategorized/d0771bad-2342-41c3-8f0a-febd6cf0b552.png',
      'd0771bad-2342-41c3-8f0a-febd6cf0b552.png',
      'hero-image/Product5.png',
      'Product5.png',
    ],
  },
];

async function main() {
  console.log(`Uploading slide images to S3 bucket ${BUCKET}...`);
  for (const mapping of slideMappings) {
    if (!fs.existsSync(mapping.localFile)) {
      console.error(`File not found: ${mapping.localFile}`);
      continue;
    }
    const buffer = fs.readFileSync(mapping.localFile);
    for (const key of mapping.s3Keys) {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: 'image/png',
        })
      );
      console.log(`[OK] Uploaded -> s3://${BUCKET}/${key} (${(buffer.length / 1024).toFixed(1)} KB)`);
    }
  }
  console.log('All slide images synced to S3 successfully.');
}

main().catch(console.error);
