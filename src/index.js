const express = require("express");
const mongoose = require("mongoose");

const app = express();
const puerto = 8080;

const conn_str = "mongodb+srv://eduardo:proyectotesis23@cluster0.la5m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Función asincrónica para conectar a MongoDB
async function conectarDB() {
  try {
    await mongoose.connect(conn_str);
    console.log("Conexión exitosa a MongoDB");
  } catch (err) {
    console.error("Error en la conexión a MongoDB:", err.message);
    // Podrías terminar el proceso si la conexión falla
    process.exit(1); // Salir del proceso con un código de error
  }
}

// Llamamos a la función para conectar a la base de datos
conectarDB();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba para asegurar que el servidor funciona
app.get("/", (req, res) => {
  res.send("¡Servidor Express está funcionando!");
});

// Inicia el servidor Express
app.listen(puerto, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err.message);
    process.exit(1); // Termina el proceso si no se puede iniciar el servidor
  } else {
    console.log("Servidor iniciado en el puerto " + puerto);
  }
});