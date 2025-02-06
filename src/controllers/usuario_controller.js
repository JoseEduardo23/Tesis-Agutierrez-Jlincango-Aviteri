import Usuario from "../models/usuario_model.js";
import mongoose from "mongoose";
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { generarJWT } from "../helpers/crearJWT.js";

const registro = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    const verificarEmailBDD = await Usuario.findOne({ email });
    if (verificarEmailBDD) return res.status(400).json({ msg: "El email ya está registrado" });
    const nuevoUser = new Usuario(req.body);
    if (typeof password !== "string" || password.trim() === "") {
        return res.status(400).json({ msg: "La contraseña no es válida" });
    }
    nuevoUser.password = await nuevoUser.encriptarPassword(password);
    const token = nuevoUser.crearToken();
    await sendMailToUser(email, token);
    await nuevoUser.save();
    res.status(200).json({ nuevoUser, msg: "Registro exitoso, revisa tu correo" });
};


const confirmEmail = async (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(400).json({ msg: "Token inválido" });
    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });
    usuarioBDD.token = null;
    usuarioBDD.confirmEmail = true;
    await usuarioBDD.save();
    res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Todos los campos son obligatorios" });
    const usuarioBDD = await Usuario.findOne({ email }).select("-__v -token -updatedAt -createdAt");
    if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no registrado" });
    if (!usuarioBDD.confirmEmail) return res.status(403).json({ msg: "Verifica tu cuenta" });
    const verificarPassword = await usuarioBDD.compararPassword(password);
    if (!verificarPassword) return res.status(404).json({ msg: "Contraseña incorrecta" });
    const token = generarJWT(usuarioBDD._id, "Usuario");
    res.status(200).json({
        nombre: usuarioBDD.nombre,
        apellido: usuarioBDD.apellido,
        direccion: usuarioBDD.direccion,
        telefono: usuarioBDD.telefono,
        _id: usuarioBDD._id,
        token,
        email: usuarioBDD.email
    });
};

const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Todos los campos son obligatorios" });
    const usuarioBDD = await Usuario.findOne({ email });
    if (!usuarioBDD) return res.status(404).json({ msg: "Usuario no registrado" });
    const token = usuarioBDD.crearToken();
    usuarioBDD.token = token;
    await sendMailToRecoveryPassword(email, token);
    await usuarioBDD.save();
    res.status(200).json({ msg: "Revisa tu correo para restablecer tu contraseña" });
};

const comprobarTokenPasword = async (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(404).json({ msg: "Token inválido" });
    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD?.token) return res.status(404).json({ msg: "Token inválido" });
    res.status(200).json({ msg: "Token válido, puedes crear una nueva contraseña" });
};

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Todos los campos son obligatorios" });
    if (password !== confirmpassword) return res.status(404).json({ msg: "Las contraseñas no coinciden" });
    const { token } = req.params;
    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD?.token) return res.status(404).json({ msg: "Token inválido" });
    usuarioBDD.token = null;
    usuarioBDD.password = await usuarioBDD.encriptarPassword(password);
    await usuarioBDD.save();
    res.status(200).json({ msg: "Contraseña actualizada, ya puedes iniciar sesión" });
};

const perfilUsuario = (req, res) => {
    delete req.UsuarioBDD.token;
    delete req.UsuarioBDD.confirmEmail;
    delete req.UsuarioBDD.createdAt;
    delete req.UsuarioBDD.updatedAt;
    delete req.UsuarioBDD.__v;
    res.status(200).json(req.UsuarioBDD);
};
const actualizarPassword = async (req, res) => {
    const { email, passwordactual, passwordnuevo } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const usuarioBDD = await Usuario.findOne({ email });
    if (!usuarioBDD) {
        return res.status(404).json({ msg: `No existe un usuario con el correo: ${email}` });
    }

    const verificarPassword = await usuarioBDD.compararPassword(passwordactual);
    if (!verificarPassword) {
        return res.status(400).json({ msg: "La contraseña actual no es correcta" });
    }

    usuarioBDD.password = await usuarioBDD.encriptarPassword(passwordnuevo);
    await usuarioBDD.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
};

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "El ID proporcionado no es válido" });
    }

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usuarioBDD = await Usuario.findById(id);
    if (!usuarioBDD) {
        return res.status(404).json({ msg: `No existe un usuario con el ID: ${id}` });
    }

    if (usuarioBDD.email !== req.body.email) {
        const usuarioBDDMail = await Usuario.findOne({ email: req.body.email });
        if (usuarioBDDMail) {
            return res.status(400).json({ msg: "El correo electrónico ya está registrado" });
        }
    }

    usuarioBDD.nombre = req.body.nombre || usuarioBDD.nombre;
    usuarioBDD.apellido = req.body.apellido || usuarioBDD.apellido;
    usuarioBDD.direccion = req.body.direccion || usuarioBDD.direccion;
    usuarioBDD.telefono = req.body.telefono || usuarioBDD.telefono;
    usuarioBDD.email = req.body.email || usuarioBDD.email;

    await usuarioBDD.save();
    res.status(200).json({ msg: "Perfil actualizado correctamente" });
};

const listarUsuarios = async (req, res) => {
    const usuariosBDD = await Usuario.find().select("-password -__v -createdAt -updatedAt")
    if (!usuariosBDD.length) return res.status(404).json({msg: "No se encontraron usuarios registrados."})
    res.status(200).json(usuariosBDD)    
}

const eliminarUsuario = async (req, res) => {
    const {id} = req.params
    const usuario = await Usuario.findByIdAndDelete(id)
    if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })
    res.status(200).json({ msg: "Usuario eliminado exitosamente" })
    
}

export {
    registro,
    login,
    confirmEmail,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    perfilUsuario,
    actualizarPassword,
    actualizarPerfil,
    listarUsuarios,
    eliminarUsuario
};
