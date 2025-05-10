import multer from "multer";
import fs from 'fs-extra'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../temp_uploads');

// Crear directorio si no existe
fs.ensureDirSync(uploadDir);

// Filtro para tipos de archivo permitidos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato inválido. Solo imágenes (JPEG, PNG, JPG, WEBP)"), false);
  }
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `producto-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Configuración de Multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter
});

// Middleware para subir una sola imagen
export const uploadProductImage = upload.single('imagen');

// Middleware para manejar errores de Multer
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        message: "El archivo es demasiado grande (máximo 10MB)"
      });
    }
    return res.status(400).json({ 
      success: false,
      message: "Error al subir el archivo" 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
  next();
};