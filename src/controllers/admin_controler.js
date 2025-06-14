import Administrador from "../models/admin_model.js";
import mongoose from 'mongoose'
import { sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { generarJWT } from "../helpers/crearJWT.js";

const registro = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        const verificarEmailBDD = await Administrador.findOne({ email });
        if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        const nuevoUser = new Administrador(req.body);
        nuevoUser.password = await nuevoUser.encrypPassword(password);
        await nuevoUser.save();
        res.status(200).json({ nuevoUser, msg: "Registro Exitoso, " + `Administrador Creado: ${nuevoUser.nombre}` });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Lo sentimos, ha ocurrido un error inesperado, intentelo de nuevo" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Debes llenar todos los campos" });
    }

    const AdministradorBDD = await Administrador.findOne({ email }).select("-status -__v -token -updatedAt -createdAt");

    if (AdministradorBDD?.confirmEmail === false) {
        return res.status(403).json({ msg: "Debe verificar su cuenta" });
    }

    if (!AdministradorBDD) {
        return res.status(404).json({ msg: "El Administrador no se encuentra registrado" });
    }

    const verificarPassword = await AdministradorBDD.matchPassword(password);
    if (!verificarPassword) {
        return res.status(404).json({ msg: "Lo sentimos, la contraseña no es correcta" });
    }

    const token = generarJWT(AdministradorBDD._id, "Administrador");

    return res.status(200).json({
        nombre: AdministradorBDD.nombre,
        apellido: AdministradorBDD.apellido,
        direccion: AdministradorBDD.direccion,
        telefono: AdministradorBDD.telefono,
        _id: AdministradorBDD._id,
        token,
        email: AdministradorBDD.email
    });
};

const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    const AdministradorBDD = await Administrador.findOne({ email });
    if (!AdministradorBDD) return res.status(404).json({ msg: "Lo sentimos, el Administrador no se encuentra registrado" });
    const token = AdministradorBDD.crearToken();
    AdministradorBDD.token = token;
    await sendMailToRecoveryPassword(email, token);
    await AdministradorBDD.save();
    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
}

const comprobarTokenPasword = async (req, res) => {
    if (!(req.params.token)) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    const AdministradorBDD = await Administrador.findOne({ token: req.params.token });
    if (AdministradorBDD?.token !== req.params.token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    await AdministradorBDD.save();

    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
}

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    if (password != confirmpassword) return res.status(404).json({ msg: "Lo sentimos, los passwords no coinciden" });
    const { token } = req.params;
    const AdministradorBDD = await Administrador.findOne({ token });
    if (AdministradorBDD?.token !== token) return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    AdministradorBDD.token = null;
    AdministradorBDD.password = await AdministradorBDD.encrypPassword(password);
    await AdministradorBDD.save();
    res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nuevo password" });
}

const perfilAdministrador = (req, res) => {
    delete req.AdministradorBDD.token
    delete req.AdministradorBDD.confirmEmail
    delete req.AdministradorBDD.createdAt
    delete req.AdministradorBDD.updatedAt
    delete req.AdministradorBDD.__v
    res.status(200).json(req.AdministradorBDD)
}

const actualizarPassword = async (req, res) => {
    const { email, passwordactual, passwordnuevo } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const AdministradorBDD = await Administrador.findOne({ email });
    if (!AdministradorBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe un Administrador con el correo: ${email}` });
    }

    const verificarPassword = await AdministradorBDD.matchPassword(passwordactual);
    if (!verificarPassword) {
        return res.status(404).json({ msg: "Lo sentimos, el password actual no es correcto" });
    }

    AdministradorBDD.password = await AdministradorBDD.encrypPassword(passwordnuevo);
    await AdministradorBDD.save();

    res.status(200).json({ msg: "Password actualizado correctamente" });
};

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, debe ser un id válido` });
    }
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    const AdministradorBDD = await Administrador.findById(id);
    if (!AdministradorBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el Administrador con ID: ${id}` });
    }

    if (AdministradorBDD.email !== req.body.email) {
        const AdministradorBDDMail = await Administrador.findOne({ email: req.body.email });
        if (AdministradorBDDMail) {
            return res.status(404).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        }
    }

    AdministradorBDD.nombre = req.body.nombre || AdministradorBDD?.nombre;
    AdministradorBDD.apellido = req.body.apellido || AdministradorBDD?.apellido;
    AdministradorBDD.direccion = req.body.direccion || AdministradorBDD?.direccion;
    AdministradorBDD.telefono = req.body.telefono || AdministradorBDD?.telefono;
    AdministradorBDD.email = req.body.email || AdministradorBDD?.email;

    await AdministradorBDD.save();

    res.status(200).json({ msg: "Perfil actualizado correctamente" });
};

export {
    registro,
    login,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    perfilAdministrador,
    actualizarPassword,
    actualizarPerfil
};