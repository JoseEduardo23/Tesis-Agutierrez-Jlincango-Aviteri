import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    imagen: {
        type: {
            url: String,
            public_id: String,
            width: Number,
            height: Number, 
            format: String    
        },
        _id: false 
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    categoria: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model('Producto', productSchema);
