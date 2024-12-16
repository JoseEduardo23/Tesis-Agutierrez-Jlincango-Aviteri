import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URL_LOCAL)
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

<<<<<<< HEAD
export default connection
=======
export default  connection
>>>>>>> 156a553277371ddd5943d49cc1b7a23d73f339c2
