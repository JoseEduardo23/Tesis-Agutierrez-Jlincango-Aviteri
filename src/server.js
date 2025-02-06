// Requerir los módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import adminrouter from './routers/admin_router.js';
import userrouter from './routers/usuario_router.js';
import productrouter from './routers/product_router.js'
import mascotarouter from "./routers/mascota_router.js"
// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones 
app.set('port', process.env.PORT || 3000);
app.use(cors({
}));

// Middlewares 
app.use(express.json());

// Rutas 
app.get('/', (req, res) => {
    res.send("Server on");
});

//Ruta de los administradores
app.use('/api', adminrouter);

//Ruta de los usuarios 
app.use('/api', userrouter);

//Ruta para los productos
app.use('/api', productrouter)

app.use("/api", mascotarouter)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Exportar la instancia de express por medio de app
export default app;