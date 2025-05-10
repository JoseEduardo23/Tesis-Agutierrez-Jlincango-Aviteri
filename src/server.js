import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminrouter from './routers/admin_router.js';
import userrouter from './routers/usuario_router.js';
import productrouter from './routers/product_router.js';
import mascotarouter from './routers/mascota_router.js';
import path from 'path';
import { fileURLToPath } from 'url';


// Inicializaciones
const app = express();
dotenv.config();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración CORS mejorada
const whitelist = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://tesis-agutierrez-jlincango-aviteri.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS bloqueado para origen: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares en orden correcto
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilitar pre-flight para todas las rutas
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para manejar preflight de Multer
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Rutas de la API
app.use('/api', adminrouter);
app.use('/api', userrouter);
app.use('/api', productrouter);
app.use('/api', mascotarouter);

// Ruta principal
app.get('/', (req, res) => {
  res.send("Servidor del sistema TIENDANIMAL 🐶🦴🏪🛒");
});

// Configuración para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'client/dist')));

// Ruta para servir el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  
  if (err.name === 'CorsError') {
    return res.status(403).json({ 
      success: false,
      message: 'Acceso no permitido por CORS'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;