import fs from 'fs-extra';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

class ImageService {
  static async uploadImage(filePath, folder, transformations = {}) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: "limit", ...transformations },
          { quality: "auto" }
        ]
      });
      
      await fs.remove(filePath);
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      await fs.remove(filePath);
      throw error;
    }
  }

  static async deleteImage(publicId) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  static async updateImage(oldPublicId, newFilePath, folder, transformations = {}) {
    try {
      // Delete old image if exists
      if (oldPublicId) {
        await this.deleteImage(oldPublicId);
      }
      
      // Upload new image
      return await this.uploadImage(newFilePath, folder, transformations);
    } catch (error) {
      await fs.remove(newFilePath);
      throw error;
    }
  }
}

export default ImageService;