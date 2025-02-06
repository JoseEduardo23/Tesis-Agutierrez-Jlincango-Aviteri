import Mascota from "../models/mascota_model.js";
import mongoose from 'mongoose';

const registrarMascota = async (req, res) => {

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    try {
        const nuevaMascota = new Mascota(req.body);
        nuevaMascota.usuario = req.UsuarioBDD._id
        await nuevaMascota.save();
        res.status(201).json({ msg: "Mascota creada con éxito", mascota: nuevaMascota });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error al crear mascota", error });
    }
};

const listarMascotas = async (req, res) => {
    try {
        // Verificar si hay un propietario asociado al usuario que inició sesión
        if (req.UsuarioBDD && req.UsuarioBDD._id) {
            const mascotas = await Mascota.find({ usuario: req.UsuarioBDD._id }).select("-createdAt -updatedAt -__v").populate("usuario", "_id nombre apellido"); 
            return res.status(200).json(mascotas);
        } else {
            return res.status(400).json({ msg: "No se ha encontrado un usuario asociado." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error al obtener las mascotas." });
    }
};

// Método para ver los detalles de una mascota en particular
const detalleMascota = async (req, res) => {
    const { id } = req.params;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe la mascota con ID ${id}` });
    }

    try {
        // Obtener los detalles de la mascota
        const mascota = await Mascota.findById(id).select("-createdAt -updatedAt -__v").populate("usuario", "_id nombre apellido"); // Detalles del usuario propietario

        if (!mascota) {
            return res.status(404).json({ msg: "Mascota no encontrada." });
        }

        return res.status(200).json(mascota);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error al obtener los detalles de la mascota." });
    }
};


const actualizarMascota = async (req, res) => {
    const { id } = req.params;
    const { nombre, raza, edad, actividad, peso } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido" });
    }

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    try {
        const mascota = await Mascota.findById(id);
        if (!mascota) {
            return res.status(404).json({ msg: "Mascota no encontrada" });
        }

        Object.assign(mascota, { nombre, raza, edad, actividad, peso });
        await mascota.save();
        res.status(200).json({ msg: "Mascota actualizada con éxito", mascota });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar mascota", error });
    }
};

const eliminarMascota = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido" });
    }

    try {
        const mascota = await Mascota.findById(id);
        if (!mascota) {
            return res.status(404).json({ msg: "Mascota no encontrada" });
        }

        await mascota.deleteOne();
        res.status(200).json({ msg: "Mascota eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar mascota", error });
    }
};

export {
    registrarMascota,
    listarMascotas,
    detalleMascota,
    actualizarMascota,
    eliminarMascota,
};
