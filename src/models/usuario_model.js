import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    require: true,
    trim: true
  },
  apellido: {
    type: String,
    require: true,
    trim: true
  },
  imagen:{
    type: String,
    trim: true, 
  },
  imagen_id:{
    type: String,
    trim: true, 
  },
  rol: {
    type: String,
    default: "Usuario"
  },
  direccion: {
    type: String,
    trim: true,
    required: true
  },
  telefono: {
    type: Number,
    trim: true,
    default: null
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    default: null
  },
  confirmEmail: {
    type: Boolean,
    default: false
  },
  favoritos: [{
    type: Schema.Types.ObjectId,
    ref: 'Producto'
  }]
},
  {
    timestamps: true,
  }
);

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

usuarioSchema.methods.crearToken = function(){
  const tokenGenerado = this.token = Math.random().toString(36).slice(2)
  return tokenGenerado
}

export default model('Usuario', usuarioSchema);
