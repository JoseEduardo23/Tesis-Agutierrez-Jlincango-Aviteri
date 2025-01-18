import Administrador from "../models/admin_model.js";
import mongoose from 'mongoose'
import { sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"
import { geenrarJWT } from "../helpers/crearJWT.js";

const registro = async (req,res) => {
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Administrador.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoUser = new Administrador(req.body)
    nuevoUser.password = await nuevoUser.encrypPassword(password)
    const token = nuevoUser.crearToken()
    await sendMailToUser(email,token)
    await nuevoUser.save()
    res.status(200).json({nuevoUser, msg:"registro Exitoso, correo electronico de confirmacion enviado"})
}

const confirmEmail = async (req,res)=>{
    const {token} = req.params
    if(!(token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const AdministradorBDD = await Administrador.findOne({token})
    if(!AdministradorBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    AdministradorBDD.token = null
    AdministradorBDD.confirmEmail=true
    await AdministradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"})

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
        return res.status(404).json({ msg: "Lo sentimos, la contraseña no es el correcto" });
    }

    const tokenJWT = geenrarJWT(AdministradorBDD._id, "Administrador");

    return res.status(200).json({
        nombre: AdministradorBDD.nombre,
        apellido: AdministradorBDD.apellido,
        direccion: AdministradorBDD.direccion,
        telefono: AdministradorBDD.telefono,
        _id: AdministradorBDD._id,
        tokenJWT,
        email: AdministradorBDD.email
    });
};

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const AdministradorBDD = await Administrador.findOne({email})
    if(!AdministradorBDD) return res.status(404).json({msg:"Lo sentimos, el Administrador no se encuentra registrado"})
    const token = AdministradorBDD.crearToken()
    AdministradorBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await AdministradorBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


const comprobarTokenPasword = async (req,res)=>{
    const {token} = req.params
    if(!(token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const AdministradorBDD = await Administrador.findOne({token})
    if(AdministradorBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await AdministradorBDD.save()
  
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const {token} = req.params
    const AdministradorBDD = await Administrador.findOne({token})
    if(AdministradorBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    AdministradorBDD.token = null
    AdministradorBDD.password = await AdministradorBDD.encrypPassword(password)
    await AdministradorBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}


const perfilAdministrador = (req, res) => {
    if (req.AdministradorBDD && req.AdministradorBDD.token) {
        delete req.AdministradorBDD.token;
    }
    res.status(200).json({
        msg: "Información del Administrador autenticado",
        Administrador:{
            nombre:req.AdministradorBDD.nombre,
            apellido:req.AdministradorBDD.apellido,
            email:req.AdministradorBDD.email,
            direccion:req.AdministradorBDD.direccion,
            telefono:req.AdministradorBDD.telefono
        }
    });
};


const actualizarPassword = async (req, res) => {
    const { email, passwordactual, passwordnuevo } = req.body;

    // Verificar que todos los campos están completos
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Buscar Administrador por email
    const AdministradorBDD = await Administrador.findOne({ email });
    if (!AdministradorBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe un Administrador con el correo: ${email}` });
    }

    // Verificar que el password actual sea correcto
    const verificarPassword = await AdministradorBDD.matchPassword(passwordactual);
    if (!verificarPassword) {
        return res.status(404).json({ msg: "Lo sentimos, el password actual no es correcto" });
    }

    // Actualizar el password con el nuevo valor
    AdministradorBDD.password = await AdministradorBDD.encrypPassword(passwordnuevo);
    await AdministradorBDD.save();

    // Confirmar que la contraseña fue actualizada
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
    confirmEmail,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword,
    perfilAdministrador,
    actualizarPassword,
    actualizarPerfil
}