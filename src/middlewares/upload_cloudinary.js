import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';


const storageMascotas = new CloudinaryStorage({
  
  cloudinary: cloudinary,
  params: {
    folder: 'mascotas',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadMascotas = multer({ storage: storageMascotas });

const storageProductos = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const uploadProductos = multer({ storage: storageProductos });

const storageUsuarios = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'usuarios',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});
const uploadUsuarios = multer({ storage: storageUsuarios });

export {uploadMascotas, uploadProductos, uploadUsuarios};

