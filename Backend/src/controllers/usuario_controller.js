import { sendMailToPaciente } from "../config/nodemailer.js"
import Usuario from "../models/usuario_model.js"
import mongoose from "mongoose"

const registrarUsuario = async (req, res) => {
    const {email} = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Debes llenar todos los campos" });
    }

    const verificarEmailBDD = await Usuario.findOne({ email });
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "El email ya se encuentra registrado" });
    }

    const nuevoUsuario = new Usuario(req.body);

    const passwordEncrypt = Math.random().toString(36).slice(2);
    nuevoUsuario.password = await nuevoUsuario.encriptarPassword("use" + passwordEncrypt);

    if (req.AdministradorBDD) {
        nuevoUsuario.usuario = req.AdministradorBDD._id;
    } else {
        return res.status(400).json({ msg: "Usuario no autenticado correctamente" });
    }

    await sendMailToPaciente(email, "use" + passwordEncrypt); 
    await nuevoUsuario.save();

    return res.status(200).json({ msg: "Registro exitoso del usuario y correo enviado" });
};



const listarUsuarios = async (req, res) => {
    const usuariosBDD = await Usuario.find().select("-password -__v -createdAt -updatedAt")
    if (!usuariosBDD.length) return res.status(404).json({msg: "No se encontraron usuarios registrados."})
    res.status(200).json(usuariosBDD)    
}


const detalleUsuario = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el usuario con el ID ${id}` });
    }

    const usuario = await Usuario.findById(id)
        .select("-createdAt -updatedAt -__v")
        .populate('nombre apellido'); 
    res.status(200).json(usuario);
}


const actualizarUsuario = async (req, res) => {
    const {id} = req.params 
    const {nombre, apellido, email, direccion, telefono} = req.body 
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg: "ID de usuario inválido"})
    if (Object.values(req.body).includes("")) return res.status(400).json({msg: "Todos los campos son obligatorios"})
    const usuario = await Usuario.findById(id)
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })
    
    if (email && usuario.email !== email) {
        const emailEnUso = await Usuario.findOne({ email })
        if (emailEnUso) {
            return res.status(400).json({ msg: "El email ya está registrado" })
        }
    }

    usuario.nombre = nombre || usuario.nombre
    usuario.apellido = apellido || usuario.apellido
    usuario.email = email || usuario.email
    usuario.direccion = direccion || usuario.direccion
    usuario.telefono = telefono || usuario.telefono
    await usuario.save()
    res.status(200).json({msg: "Usuario actualizado correctamente", usuario})
}
const eliminarUsuario = async (req, res) => {
    const {id} = req.params
    const usuario = await Usuario.findByIdAndDelete(id)
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })
    res.status(200).json({ msg: "Usuario eliminado exitosamente" })
    
}

export{
    registrarUsuario,
    listarUsuarios,
    detalleUsuario,
    actualizarUsuario,
    eliminarUsuario
}
