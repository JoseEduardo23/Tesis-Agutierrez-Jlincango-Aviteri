import Usuario from "../models/usuario_model.js";
import mongoose from "mongoose";
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { generarJWT } from "../helpers/crearJWT.js";
import cloudinary from "../config/cloudinary.js";

const registro = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    try {
        const verificarEmailBDD = await Usuario.findOne({ email });
        if (verificarEmailBDD) return res.status(400).json({ msg: "El email ya está registrado" });
        let imagenurl = "";
        let publicid = "";
        if (req.file) {
            imagenurl = req.file.path;
            publicid = req.file.filename;
        }
        const nuevoUser = new Usuario({
            ...req.body,
            imagen: imagenurl,
            imagen_id: publicid
        });
        if (typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({ msg: "La contraseña no es válida" });
        }
        nuevoUser.password = await nuevoUser.encriptarPassword(password);
        const token = nuevoUser.crearToken();
        await sendMailToUser(email, token);
        await nuevoUser.save();
        res.status(200).json({ nuevoUser, msg: "Registro exitoso, revisa tu correo" });
    } catch (error) {
        res.status(500).json({ msg: "Error al registrar el usuario", error: error.message });
    }
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
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ msg: "El email es obligatorio" });
        }

        console.log("Buscando usuario con email:", email); // Log para debug
        
        const usuarioBDD = await Usuario.findOne({ email });
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Usuario no registrado" });
        }

        console.log("Usuario encontrado. Generando token..."); // Debug
        
        const token = usuarioBDD.crearToken();
        usuarioBDD.token = token;
        await usuarioBDD.save();

        console.log("Token generado:", token); // Debug
        console.log("Enviando email a:", email); // Debug
        
        await sendMailToRecoveryPassword(email, token);
        
        res.status(200).json({ msg: "Revisa tu correo electrónico" });
        
    } catch (error) {
        console.error("Error detallado en recuperarPassword:", error);
        res.status(500).json({ 
            msg: "Error al procesar la solicitud",
            error: error.message // Envía el mensaje real (solo para desarrollo)
        });
    }
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
    const usuario = req.UsuarioBDD;
    
    delete usuario.token;
    delete usuario.confirmEmail;
    delete usuario.createdAt;
    delete usuario.updatedAt;
    delete usuario.__v;

    res.status(200).json({
        ...usuario._doc,  
        imagen: {
            url: usuario.imagen || null, 
        },
    });
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

    try {
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
        if (req.file) {
            if (usuarioBDD.imagen_id) {
                await cloudinary.uploader.destroy(usuarioBDD.imagen_id);
            }
            usuarioBDD.imagen = req.file.path;
            usuarioBDD.imagen_id = req.file.filename;
        }

        usuarioBDD.nombre = req.body.nombre || usuarioBDD.nombre;
        usuarioBDD.apellido = req.body.apellido || usuarioBDD.apellido;
        usuarioBDD.direccion = req.body.direccion || usuarioBDD.direccion;
        usuarioBDD.telefono = req.body.telefono || usuarioBDD.telefono;
        usuarioBDD.email = req.body.email || usuarioBDD.email;

        await usuarioBDD.save();
        res.status(200).json({ msg: "Perfil actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el perfil", error: error.message });

    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuariosBDD = await Usuario.find();
        const ahora = new Date();

        // Verificar y actualizar estado según el tiempo transcurrido
        const actualizaciones = usuariosBDD.map(async (usuario) => {
            const creado = new Date(usuario.createdAt);
            const diasTranscurridos = (ahora - creado) / (1000 * 60 * 60 * 24);

            if (diasTranscurridos > 31 && usuario.estado === true) {
                usuario.estado = false;
                await usuario.save();
            }
        });

        await Promise.all(actualizaciones);

        const usuariosActualizados = await Usuario.find().select("-password -__v -createdAt -updatedAt");
        if (!usuariosActualizados.length) return res.status(404).json({ msg: "No se encontraron usuarios registrados." });

        res.status(200).json(usuariosActualizados);
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ msg: "Error al obtener los usuarios" });
    }
};

const eliminarUsuario = async (req, res) => {
    const { id } = req.params
    try {
        const usuario = await Usuario.findByIdAndDelete(id)
        if (!usuario) return res.status(404).json({ msg: "Usuario no encontrado" })
        if (usuario.imagen_id) {
            await cloudinary.uploader.destroy(usuario.imagen_id)
        }
        res.status(200).json({ msg: "Usuario eliminado exitosamente" })

    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el usuario", error: error.message }) ;
    }
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
