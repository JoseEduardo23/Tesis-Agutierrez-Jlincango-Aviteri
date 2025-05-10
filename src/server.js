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

// Configuraciones
app.set('port', process.env.PORT || 3000);

// Configuración CORS
const corsOptions = {
  origin: process.env.URL_FRONTEND,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas de la API
app.use('/api', adminrouter);
app.use('/api', userrouter);
app.use('/api', productrouter);
app.use('/api', mascotarouter);

// Ruta principal
app.get('/', (req, res) => {
    res.send("Servidor del sistema TIENDANIMAL 🐶🦴🏪🛒");
});

// Configuración para servir los archivos estáticos de React desde la carpeta "dist"
app.use(express.static(path.join(__dirname, 'client/dist')));

// Ruta para servir el index.html cuando no se encuentra una ruta de API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// Manejo de rutas no encontradas (solo para la API)
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Exportar la instancia de express
export default app;