// utils/cloudinary.ts
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const uploadStream = cloudinary.v2.uploader.upload_stream(
    { folder: 'profile-pictures' },
    (error, result) => {
      if (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error('Failed to upload image');
      }
      return result.secure_url;
    }
  );

  return new Promise((resolve, reject) => {
    file.stream().pipe(uploadStream);
    uploadStream.on('finish', () => resolve(uploadStream.result.secure_url));
    uploadStream.on('error', (error) => reject(error));
  });
};