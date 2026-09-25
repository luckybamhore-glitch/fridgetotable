import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary with environment variables
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  console.log('✅ Cloudinary initialized successfully');
} else {
  console.log('ℹ️ Cloudinary credentials not provided or using defaults. Running in fallback/data-URI mode.');
}

/**
 * Uploads a buffer to Cloudinary, with fallback to data URI if Cloudinary is not configured.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} mimetype - File mimetype e.g. 'image/jpeg'
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {Promise<{ url: string, public_id?: string, isFallback: boolean }>}
 */
export const uploadImage = async (buffer, mimetype = 'image/jpeg', folder = 'fridge-to-table') => {
  if (!isCloudinaryConfigured) {
    const base64 = buffer.toString('base64');
    const dataUri = `data:${mimetype};base64,${base64}`;
    return {
      url: dataUri,
      public_id: `local_${Date.now()}`,
      isFallback: true,
      message: 'Uploaded in local preview mode (Cloudinary keys not set)'
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1400, crop: 'limit', quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) {
          console.warn('⚠️ Cloudinary upload failed, falling back to data URI:', error.message);
          const base64 = buffer.toString('base64');
          return resolve({
            url: `data:${mimetype};base64,${base64}`,
            public_id: `fallback_${Date.now()}`,
            isFallback: true
          });
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          isFallback: false
        });
      }
    );

    uploadStream.end(buffer);
  });
};

export { cloudinary, isCloudinaryConfigured };
