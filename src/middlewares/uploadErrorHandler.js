import multer from 'multer';

const uploadErrorHandler = (err, req, res, next) => {
  // Log detallado para diagnóstico
  console.error('Error en upload:', {
    errorName: err?.name,
    errorCode: err?.code,
    errorMessage: err?.message,
    stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    file: req?.file,
    body: req?.body
  });

  // Manejo específico de errores de Multer
  if (err instanceof multer.MulterError) {
    const errorMap = {
      LIMIT_FILE_SIZE: {
        status: 400,
        message: 'El archivo excede el tamaño máximo permitido (10MB)'
      },
      LIMIT_FILE_COUNT: {
        status: 400,
        message: 'Demasiados archivos. Solo se permite uno'
      },
      LIMIT_FIELD_KEY: {
        status: 400,
        message: 'Nombre de campo del formulario demasiado largo'
      },
      LIMIT_FIELD_VALUE: {
        status: 400,
        message: 'Valor de campo del formulario demasiado largo'
      },
      LIMIT_FIELD_COUNT: {
        status: 400,
        message: 'Demasiados campos en el formulario'
      },
      LIMIT_PART_COUNT: {
        status: 400,
        message: 'Demasiadas partes en el formulario'
      },
      LIMIT_UNEXPECTED_FILE: {
        status: 400,
        message: 'Tipo de archivo no esperado o campo incorrecto'
      }
    };

    const errorConfig = errorMap[err.code] || {
      status: 400,
      message: 'Error al procesar el archivo subido'
    };

    return res.status(errorConfig.status).json({
      success: false,
      error: {
        code: err.code,
        message: errorConfig.message,
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }
    });
  }

  // Manejo de otros tipos de errores
  if (err) {
    return res.status(400).json({
      success: false,
      error: {
        message: err.message || 'Error al procesar la solicitud',
        type: err.name,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
    });
  }

  next();
};

export default uploadErrorHandler;