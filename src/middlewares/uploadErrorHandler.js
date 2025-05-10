import multer from 'multer';

const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        msg: "El archivo es demasiado grande (máximo 10MB)" 
      });
    }
    return res.status(400).json({ msg: "Error al subir el archivo" });
  } else if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
};

export default uploadErrorHandler;