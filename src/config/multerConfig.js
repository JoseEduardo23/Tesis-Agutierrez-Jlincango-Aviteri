import multer from "multer";
import fs from 'fs-extra'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../temp_uploads');

// Verificar/Crear directorio con permisos
try {
  fs.ensureDirSync(uploadDir);
  fs.chmodSync(uploadDir, 0o777); // Dar permisos de escritura
} catch (err) {
  console.error('Error al configurar directorio de uploads:', err);
  throw err;
}

// Limpiar archivos temporales periódicamente
setInterval(() => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error('Error limpiando temp_uploads:', err);
    
    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, err => {
        if (err) console.error('Error eliminando archivo temporal:', filePath, err);
      });
    });
  });
}, 3600000); // Cada hora

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato inválido. Solo imágenes (JPEG, PNG, JPG, WEBP)"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `producto-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

export const uploadProductImage = upload.single('imagen');

export const handleUploadErrors = (err, req, res, next) => {
  console.error('Error en upload:', err); // Log detallado
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        message: "El archivo es demasiado grande (máximo 10MB)"
      });
    }
    return res.status(400).json({ 
      success: false,
      message: `Error al subir el archivo: ${err.code}`
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
  next();
};