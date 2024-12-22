import { sendMailToPaciente } from "../config/nodemailer.js";
import Usuario from "../models/usuario_model.js";

const registrarUsuario = async (req, res) => {
    res.send("Usuario registrado");
}
const listarUsuarios = async (req, res) => {
    res.send("Lista de usuarios");
}
const detalleUsuario = async (req, res) => {
    res.send("Detalle de usuario");
}
const actualizarUsuario = async (req, res) => {
    res.send("Usuario actualizado");
}
const eliminarUsuario = async (req, res) => {
    res.send("Usuario eliminado");
}

export{
    registrarUsuario,
    listarUsuarios,
    detalleUsuario,
    actualizarUsuario,
    eliminarUsuario
}
