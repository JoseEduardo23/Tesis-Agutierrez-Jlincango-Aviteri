import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Verificación de variables de entorno
const requiredConfig = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingConfig = requiredConfig.filter(key => !process.env[key]);

if (missingConfig.length > 0) {
  throw new Error(`Faltan configuraciones de Cloudinary: ${missingConfig.join(', ')}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('Cloudinary configurado correctamente para el cloud:', process.env.CLOUDINARY_CLOUD_NAME);

export default cloudinary;