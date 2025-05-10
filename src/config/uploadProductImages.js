import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import sanitizeFilename from 'sanitize-filename';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../temp_uploads_productos');

// Crear directorio con permisos
fs.ensureDirSync(uploadDir);
fs.chmodSync(uploadDir, 0o755);

// Tipos MIME permitidos
const allowedMimeTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
};

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido. Solo: ${Object.keys(allowedMimeTypes).join(', ')}`), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = sanitizeFilename(file.originalname);
    const extension = allowedMimeTypes[file.mimetype] || path.extname(originalName).slice(1);
    cb(null, `producto-${uniqueSuffix}.${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter
});

// Middleware con manejo de CORS explícito
const uploadProductImage = (req, res, next) => {
  // Setear headers CORS específicos para Multer
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      // Limpiar archivo si hay error
      if (req.file) fs.unlink(req.file.path).catch(console.error);
      return next(err);
    }
    next();
  });
};

export default uploadProductImage;