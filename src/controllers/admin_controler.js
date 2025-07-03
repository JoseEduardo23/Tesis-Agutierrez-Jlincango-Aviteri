import Administrador from "../models/admin_model.js";
import mongoose from 'mongoose'
import { sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { generarJWT } from "../helpers/crearJWT.js";


const login = async (req, res) => {
    const { email, password } = req.body;

    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" });
    
    try {
        const AdministradorBDD = await Administrador.findOne({ email }).select(" -__v -token -updatedAt -createdAt");
        if (!AdministradorBDD) return res.status(404).json({ msg: "El Administrador no se encuentra registrado" });
    
        const verificarPassword = await AdministradorBDD.matchPassword(password);
        if (!verificarPassword) return res.status(401).json({ msg: "La contraseña no es correcta, intentelo de nuevo" });
        if (AdministradorBDD.estado==false) return res.status(401).json({ msg: "Lo sentimos, el Administrador se encuentra inactivo" });
        
        const token = generarJWT(AdministradorBDD._id, "Administrador");
    
        return res.status(200).json({
            nombre: AdministradorBDD.nombre,
            apellido: AdministradorBDD.apellido,
            direccion: AdministradorBDD.direccion,
            telefono: AdministradorBDD.telefono,
            _id: AdministradorBDD._id,
            token,
            msg: "Bienvenido al sistema de administración de Tiendanimal",
        });
    } catch (error) {
        return res.status(500).json({ msg: "Lo sentimos, ocurrió un error al iniciar sesión. Intentelo de nuevo más tarde" })
    }
};

const recuperarPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Debes llenar el campo correctamente" });
    try {
        const AdministradorBDD = await Administrador.findOne({ email });
        if (!AdministradorBDD) return res.status(404).json({ msg: "Lo sentimos, el Administrador no se encuentra registrado" });
        const token = AdministradorBDD.crearToken();
        AdministradorBDD.token = token;
        AdministradorBDD.tokenExpiracion = Date.now() + 3600000;  
        await sendMailToRecoveryPassword(email, token);
        await AdministradorBDD.save();
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
    } catch (error) {
        res.status(500).json({ msg: "Lo sentimos, ocurrió un error al enviar el correo de recuperación" });
    }
}

const comprobarTokenPasword = async (req, res) => {
    if (!(req.params.token)) return res.status(404).json({ msg: "Debe proporcionar un token para validar la acción" });
    try {   
        const AdministradorBDD = await Administrador.findOne({ token: req.params.token });
        if (AdministradorBDD?.token !== req.params.token) return res.status(400).json({ msg: "Lo sentimos, el token de recuperación de contraseña es inválido" });
        if (AdministradorBDD.tokenExpiracion && AdministradorBDD.tokenExpiracion < Date.now()) return res.status(403).json({ msg: "El token ha expirado, por favor envía una nueva solicitud" });
        
        await AdministradorBDD.save();
        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" });
    } catch (error) {
        res.status(500).json({ msg: "Ocurrió un error al comprobar el token" })
    }
}

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;
    const { token } = req.params;
    
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    if (!token) return res.status(400).json({ msg: "El token es obligatorio para crear una nueva contraseña" });
    if (password.length < 8 || password.length > 20) return res.status(400).json({ msg: "La contraseña nueva debe tener entre 8 y 20 caracteres" });
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)) return res.status(400).json({msg: "La contraseña nueva debe tener al menos una mayúscula, una minúscula, un número y un símbolo especial"})
    if (password !== confirmpassword) return res.status(400).json({ msg: "Las contraseñas no coinciden" });
    try {
        const AdministradorBDD = await Administrador.findOne({ token });
        if (!AdministradorBDD) return res.status(404).json({ msg: "Token inválido" });
        if (AdministradorBDD?.token !== token) return res.status(401).json({ msg: "Token inválido"});
        if (AdministradorBDD.tokenExpiracion && AdministradorBDD.tokenExpiracion < Date.now()) return res.status(403).json({ msg: "El token ha expirado. Solicita un nuevo enlace de recuperación" })
        const mismaPassword = await AdministradorBDD.matchPassword(password)
        if(mismaPassword) return res.status(400).json({ msg: "La nueva contraseña no puede ser igual a la anterior" })
        AdministradorBDD.token = null
        AdministradorBDD.tokenExpiracion = null
        AdministradorBDD.password = await AdministradorBDD.encrypPassword(password);
        await AdministradorBDD.save();
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesión con tu nueva contraseña" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Lo sentimos, ocurrió un error al registrar la nueva contraseña" });
    }
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

    if (!email || !passwordactual || !passwordnuevo) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    
    if (passwordnuevo.length < 8 || passwordnuevo.length > 20) return res.status(400).json({ msg: "La contraseña nueva debe tener entre 8 y 20 caracteres" })

    if (!passwordnuevo.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)) return res.status(400).json({msg: "La contraseña nueva debe tener al menos una mayúscula, una minúscula, un número y un símbolo especial"});
    
    if (passwordactual === passwordnuevo) return res.status(400).json({ msg: "La nueva contraseña no puede ser igual a la actual" })
    try {
        const AdministradorBDD = await Administrador.findOne({ email });
        if (!AdministradorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe un Administrador con el correo: ${email}` });
        if (!(AdministradorBDD.email == req.AdministradorBDD.email)) return res.status(403).json({ msg: "Lo sentimos, no tienes permiso para actualizar la contraseña de este Administrador" });
        const verificarPassword = await AdministradorBDD.matchPassword(passwordactual);
        if (!verificarPassword) return res.status(401).json({ msg: "La contraseña actual no es correcta" });
        AdministradorBDD.password = await AdministradorBDD.encrypPassword(passwordnuevo);
         
        await AdministradorBDD.save();
        
        res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Lo sentimos, ocurrió un error al actualizar la contraseña, intentelo más tarde." });
    }
};

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: `El id no es válido` });
    
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Por favor, debes llenar todos los campos" });
    try {
        
        const AdministradorBDD = await Administrador.findById(id);
        if (!AdministradorBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el Administrador con ID: ${id}` });
        
    
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
    } catch (error) {
        res.status(500).json({ msg: "Lo sentimos, ocurrió un error al actualizar el perfil, intentelo más tarde." });
    }
};

export {
    login,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    perfilAdministrador,
    actualizarPassword,
    actualizarPerfil
};