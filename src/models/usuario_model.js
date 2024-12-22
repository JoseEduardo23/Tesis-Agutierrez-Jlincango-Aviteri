import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true  
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    direccion:{
        type:String,
        required:true,
        trim:true
    },
    celular:{
        type:String,
        require:true,
        trim:true
    },
    estado:{
        type:Boolean,
        default:true
    }
})

usuarioSchema.methods.encriptarPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypt = await bcrypt.hash(password, salt);
    return await bcrypt.hash(password, salt);
}

usuarioSchema.methods.compararPassword = async function(password){
    const response = await bcrypt.compare(password, this.password);
    return response;
}

export default model('Usuario', usuarioSchema);