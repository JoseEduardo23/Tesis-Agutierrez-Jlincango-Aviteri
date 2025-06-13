import mongoose, { Schema, model } from "mongoose";
const mascotaDieta = new Schema({
  
});
const mascotaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    imagen:{
      type: String,
      trim: true, 
    },
    imagen_id:{
      type: String,
      trim: true, 
    },
    raza: {
      type: String,
      required: true,
      trim: true,
    },
    edad: {
      type: Number,
      required: true,
    },
    actividad: {
      type: String,
      required: true,
      trim: true,
      enum:['Mucha','Normal','Regular',"Baja","Nula"]
    },
    peso: {
      type: Number,
      required: true,
    },
    dieta:{
      type: String,
      default:null,
    },
    enfermedades:{
      type: String,
      default:null,
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Mascota", mascotaSchema);
