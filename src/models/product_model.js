import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    imagen: {
        type: {
            url: {
                type: String,
                required: false
            },
            public_id: {
                type: String,
                required: false
            },
            width: Number,
            height: Number, 
            format: String    
        },
        required: false,
        _id: false 
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo'],
        set: v => parseFloat(v.toFixed(2)) 
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true,
        enum: {
            values: ['Perros', 'Gatos', 'Peces', 'Aves'],
            message: 'Categoría no válida. Valores permitidos: {VALUE}'
        },
        lowercase: true
    }
}, {
    timestamps: true,
    versionKey: false, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
});

export default model('Producto', productSchema);
