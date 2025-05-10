import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../temp_uploads_productos');

// Configuración del directorio temporal
try {
  // Crear directorio con permisos explícitos
  fs.ensureDirSync(uploadDir);
  fs.chmodSync(uploadDir, 0o755); // Permisos: owner rwx, group r-x, others r-x
  
  console.log(`Directorio temporal configurado en: ${uploadDir}`);
} catch (err) {
  console.error('Error configurando directorio temporal:', err);
  throw err;
}

// Limpieza periódica de archivos temporales
setInterval(() => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error('Error leyendo directorio temporal:', err);
    
    const now = Date.now();
    const oneHour = 3600000; // 1 hora en ms
    
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error('Error obteniendo stats de archivo:', filePath, err);
        
        // Eliminar archivos con más de 1 hora de antigüedad
        if (now - stats.mtimeMs > oneHour) {
          fs.unlink(filePath, err => {
            if (err) console.error('Error eliminando archivo temporal:', filePath, err);
            else console.log('Archivo temporal limpiado:', filePath);
          });
        }
      });
    });
  });
}, 3600000); // Ejecutar cada hora

// Validación de tipos MIME más estricta
const mimeTypeMap = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
};

const fileFilter = (req, file, cb) => {
  if (mimeTypeMap[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`Formato inválido. Solo se permiten: ${Object.keys(mimeTypeMap).join(', ')}`), false);
  }
};

// Configuración de almacenamiento mejorada
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = sanitizeFilename(file.originalname);
    const extension = mimeTypeMap[file.mimetype] || path.extname(originalName).slice(1);
    const safeFilename = `producto-${uniqueSuffix}.${extension}`;
    
    cb(null, safeFilename);
  }
});

// Configuración final de Multer
const uploadProductImage = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1 // Solo permitir un archivo
  },
  fileFilter,
  preservePath: false // No usar paths completos por seguridad
}).single("imagen");

// Middleware adicional para logging
export const uploadWithLogging = (req, res, next) => {
  console.log('Iniciando subida de imagen...');
  
  uploadProductImage(req, res, (err) => {
    if (err) {
      console.error('Error en subida de imagen:', {
        error: err.message,
        file: req.file,
        body: req.body
      });
      return next(err);
    }
    
    if (req.file) {
      console.log('Imagen subida temporalmente:', {
        filename: req.file.filename,
        size: `${(req.file.size / 1024).toFixed(2)} KB`,
        mimetype: req.file.mimetype,
        path: req.file.path
      });
    }
    
    next();
  });
};

export default uploadWithLogging;