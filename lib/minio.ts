import * as Minio from 'minio'

// MinIO Client Configuration
export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'foss-andhra-gallery'

// Initialize bucket if it doesn't exist
export async function ensureBucketExists() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      
      // Set bucket policy to allow public read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      }
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
      console.log(`✅ Bucket "${BUCKET_NAME}" created and configured`)
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error)
    throw error
  }
}

// Upload file to MinIO
export async function uploadToMinio(
  file: Buffer,
  filename: string,
  mimeType: string,
  metadata?: Record<string, string>
) {
  try {
    await ensureBucketExists()

    const metaData = {
      'Content-Type': mimeType,
      ...metadata,
    }

    await minioClient.putObject(BUCKET_NAME, filename, file, file.length, metaData)

    // Generate public URL
    const url = `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`}/${BUCKET_NAME}/${filename}`

    return { success: true, url, filename }
  } catch (error) {
    console.error('Error uploading to MinIO:', error)
    return { success: false, error }
  }
}

// Delete file from MinIO
export async function deleteFromMinio(filename: string) {
  try {
    await minioClient.removeObject(BUCKET_NAME, filename)
    return { success: true }
  } catch (error) {
    console.error('Error deleting from MinIO:', error)
    return { success: false, error }
  }
}

// Get file URL
export function getMinioUrl(filename: string) {
  return `${process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`}/${BUCKET_NAME}/${filename}`
}
