import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminrouter from './routers/admin_router.js';
import userrouter from './routers/usuario_router.js';
import productrouter from './routers/product_router.js';
import mascotarouter from './routers/mascota_router.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('port', process.env.PORT || 3000);

const corsOptions = {

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api', adminrouter);
app.use('/api', userrouter);
app.use('/api', productrouter);
app.use('/api', mascotarouter);

// Ruta principal
app.get('/', (req, res) => {
    res.send("Servidor del sistema TIENDANIMAL 🐶🦴🏪🛒");
});

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

export default app;