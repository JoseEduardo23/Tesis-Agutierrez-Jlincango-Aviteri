import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URL_PRODUCCION)
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}
export default connection
