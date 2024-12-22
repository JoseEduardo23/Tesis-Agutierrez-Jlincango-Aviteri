import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

// Método de instancia para encriptar la contraseña
usuarioSchema.methods.encriptarPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Método de instancia para comparar contraseñas
usuarioSchema.methods.compararPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

export default model('Usuario', usuarioSchema);
