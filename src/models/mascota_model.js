import mongoose, { Schema, model } from "mongoose";

const mascotaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
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
