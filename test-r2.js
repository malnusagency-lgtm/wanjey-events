const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const r2BucketName = process.env.R2_BUCKET_NAME;

console.log('R2 Config:');
console.log('- Account ID:', r2AccountId);
console.log('- Access Key:', r2AccessKeyId ? '***' + r2AccessKeyId.slice(-4) : 'MISSING');
console.log('- Secret Key:', r2SecretAccessKey ? 'PRESENT' : 'MISSING');
console.log('- Bucket Name:', r2BucketName);

if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName) {
  console.error('Error: Missing R2 environment variables!');
  process.exit(1);
}

const client = new S3Client({
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
  region: 'auto',
});

async function runTest() {
  try {
    console.log('\nTesting R2 List command...');
    const listCommand = new ListObjectsV2Command({
      Bucket: r2BucketName,
      MaxKeys: 5,
    });
    const listResponse = await client.send(listCommand);
    console.log('R2 List Command Succeeded!');
    console.log('Found objects:', (listResponse.Contents || []).length);
    if (listResponse.Contents) {
      listResponse.Contents.forEach(obj => {
        console.log(` - ${obj.Key} (${obj.Size} bytes)`);
      });
    }

    console.log('\nTesting R2 Upload (PutObject) command...');
    const testKey = 'wanjey/test-connection.txt';
    const putCommand = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: testKey,
      Body: 'Connection Test Successful',
      ContentType: 'text/plain',
    });
    await client.send(putCommand);
    console.log('R2 Upload Command Succeeded! File uploaded to key:', testKey);

  } catch (error) {
    console.error('\nR2 Operation Failed with error:');
    console.error(error);
  }
}

runTest();
