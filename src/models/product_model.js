import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
    },
    imagen: {
        type: String
    }
}, {
    timestamps: true,
});

export default model('Producto', productSchema);
