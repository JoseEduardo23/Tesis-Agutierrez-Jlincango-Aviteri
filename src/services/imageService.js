import fs from 'fs-extra';
import cloudinary from '../config/cloudinary.js';
import path from 'path';

class ImageService {
  static async validateFile(filePath) {
    try {
      await fs.access(filePath, fs.constants.R_OK);
      const stats = await fs.stat(filePath);
      if (stats.size === 0) throw new Error('El archivo está vacío');
      return true;
    } catch (error) {
      throw new Error(`Archivo inválido: ${error.message}`);
    }
  }

  static async uploadWithRetry(uploadFn, maxRetries = 2, delay = 1000) {
    let attempts = 0;
    let lastError;
    
    while (attempts < maxRetries) {
      try {
        return await uploadFn();
      } catch (error) {
        lastError = error;
        attempts++;
        if (attempts < maxRetries) {
          await new Promise(res => setTimeout(res, delay * attempts));
        }
      }
    }
    throw lastError;
  }

  static async uploadImage(filePath, folder, transformations = {}) {
    try {
      // Validar archivo antes de procesar
      await this.validateFile(filePath);

      // Configuración base de Cloudinary
      const uploadOptions = {
        folder,
        transformation: [
          { 
            width: 800, 
            height: 800, 
            crop: "limit", 
            ...transformations 
          },
          { quality: "auto" }
        ],
        timeout: 30000 // 30 segundos timeout
      };

      console.log(`Subiendo imagen: ${path.basename(filePath)} a Cloudinary...`);
      
      // Subir con mecanismo de reintento
      const result = await this.uploadWithRetry(
        () => cloudinary.uploader.upload(filePath, uploadOptions)
      );

      console.log(`Imagen subida exitosamente: ${result.public_id}`);
      
      // Limpiar archivo temporal
      await fs.remove(filePath);
      
      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error(`Error subiendo imagen ${filePath}:`, error);
      
      // Intentar limpiar archivo temporal incluso en caso de error
      try {
        await fs.remove(filePath);
      } catch (cleanupError) {
        console.error('Error limpiando archivo temporal:', cleanupError);
      }
      
      throw new Error(`Error al subir imagen: ${error.message}`);
    }
  }

  static async deleteImage(publicId) {
    if (!publicId) return;

    try {
      console.log(`Eliminando imagen de Cloudinary: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true
      });
      
      if (result.result !== 'ok') {
        throw new Error(`Cloudinary no pudo eliminar la imagen: ${result.result}`);
      }
      
      console.log(`Imagen eliminada: ${publicId}`);
      return true;
    } catch (error) {
      console.error(`Error eliminando imagen ${publicId}:`, error);
      throw new Error(`Error al eliminar imagen: ${error.message}`);
    }
  }

  static async updateImage(oldPublicId, newFilePath, folder, transformations = {}) {
    try {
      // Validar nuevo archivo primero
      await this.validateFile(newFilePath);

      // Eliminar imagen anterior si existe
      if (oldPublicId) {
        try {
          await this.deleteImage(oldPublicId);
        } catch (deleteError) {
          console.warn(`No se pudo eliminar imagen anterior: ${deleteError.message}`);
          // Continuar de todos modos con la subida
        }
      }
      
      // Subir nueva imagen
      return await this.uploadImage(newFilePath, folder, transformations);
    } catch (error) {
      // Limpiar archivo temporal en caso de error
      try {
        await fs.remove(newFilePath);
      } catch (cleanupError) {
        console.error('Error limpiando archivo temporal:', cleanupError);
      }
      
      throw error;
    }
  }
}

export default ImageService;