import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.set('strictQuery', true);

const connection = async () => {
  try {
    // Verifica si la variable de entorno está cargada correctamente
    console.log('MongoDB URL:', process.env.MONGODB_URL_PRODUCTION);

    const { connection } = await mongoose.connect(process.env.MONGODB_URL_PRODUCTION);
    console.log(`Database is connected on ${connection.host} - ${connection.port}`);
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

export default connection;