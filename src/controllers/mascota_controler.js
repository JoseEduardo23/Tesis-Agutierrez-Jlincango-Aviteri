import Mascota from "../models/mascota_model.js";
import mongoose from 'mongoose';
import cloudinary from "../config/cloudinary.js";


const registrarMascota = async (req, res) => {
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    try {
        let imagenurl = "";
        let publicid = "";
        if (req.file) {
            imagenurl = req.file.path;
            publicid = req.file.filename;
        }

        const nuevaMascota = new Mascota({
            ...req.body,
            imagen: imagenurl,
            imagen_id: publicid,
            usuario: req.UsuarioBDD._id
        });
        await nuevaMascota.save();
        res.status(201).json({ msg: "Mascota creada con éxito", mascota: nuevaMascota });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al crear mascota", error:error.message });
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "ID inválido" });
        }
    
        try {
            const mascota = await Mascota.findOne({ 
                _id: id, 
                usuario: req.UsuarioBDD._id
            }).populate("usuario", "_id nombre apellido");
    
            if (!mascota) {
                return res.status(403).json({ msg: "No tienes permisos para ver esta mascota" });
            }
    
            res.status(200).json(mascota);
        } catch (error) {
            res.status(500).json({ msg: "Error al obtener la mascota", error:error.message });
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
        const mascota = await Mascota.findById(id).findOne({ usuario: req.UsuarioBDD._id });
        if (!mascota) {
            return res.status(403).json({ msg: "No tienes permisos para eliminar esta mascota o no se ha encontrado el registro" });
        }
        // borro la anterior imagen de Cloudinary y guardo la nueva
        if (req.file) {
            if (mascota.imagen_id) {
                 await cloudinary.uploader.destroy(mascota.imagen_id);
            }
            mascota.imagen = req.file.path;
            mascota.imagen_id = req.file.filename;
        }
        Object.assign(mascota, { nombre, raza, edad, actividad, peso });
        await mascota.save();
        res.status(200).json({ msg: "Mascota actualizada con éxito", mascota });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al actualizar mascota", error:error.message });
    }
};

const eliminarMascota = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido" });
    }

    try {
        const mascota = await Mascota.findById(id).findOne({ usuario: req.UsuarioBDD._id });
        if (!mascota) {
            return res.status(403).json({ msg: "No tienes permisos para eliminar esta mascota o no se ha encontrado el registro" });
        }
        if (mascota.imagen_id) {
             await cloudinary.uploader.destroy(mascota.imagen_id);
        }
        
        await mascota.deleteOne();
        res.status(200).json({ msg: "Mascota eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar mascota", error:error.message });
    }
};

export {
    registrarMascota,
    listarMascotas,
    detalleMascota,
    actualizarMascota,
    eliminarMascota,
};
