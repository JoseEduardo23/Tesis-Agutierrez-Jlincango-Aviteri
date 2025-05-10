import multer from 'multer';
import fs from 'fs-extra'

const uploadErrorHandler = (err, req, res, next) => {
  // Limpiar archivo temporal en caso de error
  if (req.file) {
    fs.unlink(req.file.path).catch(cleanupErr => {
      console.error('Error limpiando archivo temporal:', cleanupErr);
    });
  }

  if (err instanceof multer.MulterError) {
    const errorMessages = {
      LIMIT_FILE_SIZE: 'El archivo excede el límite de 10MB',
      LIMIT_FILE_COUNT: 'Solo se permite un archivo',
      LIMIT_UNEXPECTED_FILE: 'Campo de archivo incorrecto (debe ser "imagen")'
    };
    
    return res.status(400).json({
      success: false,
      message: errorMessages[err.code] || 'Error al subir el archivo',
      errorType: 'UPLOAD_ERROR'
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Error al procesar el archivo',
      errorType: 'VALIDATION_ERROR'
    });
  }
  
  next();
};

export default uploadErrorHandler;