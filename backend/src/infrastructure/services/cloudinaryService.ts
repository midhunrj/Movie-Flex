import cloudinary from "cloudinary";
import Multer from 'multer'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "user_uploads",
          use_filename: true,
          unique_filename: true,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(new Error("Cloudinary upload failed"));
          }
          if (result) {

            return resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }
}