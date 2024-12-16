// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
<<<<<<< HEAD
import cors from 'cors'
import router from './routers/user_router.js'
=======
import cors from 'cors';


>>>>>>> 156a553277371ddd5943d49cc1b7a23d73f339c2

// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.PORT || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())

<<<<<<< HEAD
=======

// Variables globales


>>>>>>> 156a553277371ddd5943d49cc1b7a23d73f339c2
// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})
<<<<<<< HEAD
app.use('/api',router)
// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))
=======
>>>>>>> 156a553277371ddd5943d49cc1b7a23d73f339c2

// Exportar la instancia de express por medio de app
export default  app