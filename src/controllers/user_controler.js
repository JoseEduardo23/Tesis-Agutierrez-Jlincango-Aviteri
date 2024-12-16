import Usuario from "../models/user_model.js";
import { sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js"

const registro = async (req,res) => {
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Usuario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoUser = new Usuario(req.body)
    nuevoUser.password = await nuevoUser.encrypPassword(password)
    const token = nuevoUser.crearToken()
    await sendMailToUser(email,token)
    await nuevoUser.save()
    res.status(200).json({nuevoUser, msg:"registro Exitoso, correo electronico de confirmacion enviado"})
}

const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(usuarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Debe verificar su cuenta"})
    if(!usuarioBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
    const verificarPassword = await usuarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, la contraseña no es el correcto"})
    const {nombre,apellido,direccion,telefono,_id} = usuarioBDD
    res.status(200).json({
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:usuarioBDD.email
    })
    
}

const confirmEmail = async (req,res)=>{
    const {token} = req.params
    if(!(token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const usuarioBDD = await Usuario.findOne({token})
    if(!usuarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    usuarioBDD.token = null
    usuarioBDD.confirmEmail=true
    await usuarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"})

}

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const usuarioBDD = await Usuario.findOne({email})
    if(!usuarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = usuarioBDD.crearToken()
    usuarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await usuarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


const comprobarTokenPasword = async (req,res)=>{
    const {token} = req.params
    if(!(token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const usuarioBDD = await Usuario.findOne({token})
    if(usuarioBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await usuarioBDD.save()
  
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const {token} = req.params
    const usuarioBDD = await Usuario.findOne({token})
    if(usuarioBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    usuarioBDD.token = null
    usuarioBDD.password = await usuarioBDD.encrypPassword(password)
    await usuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}


const actualizarPassword = async (req, res) => {
    const { passwordactual, passwordnuevo } = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    if (!req.usuarioBDD) {
        return res.status(404).json({ msg: "No se encontró al usuario en la solicitud" });
    }

    const usuarioBDD = await Usuario.findById(req.usuarioBDD._id);
    if (!usuarioBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el usuario con ID: ${req.usuarioBDD._id}` });
    }

    const verificarPassword = await usuarioBDD.matchPassword(passwordactual);
    if (!verificarPassword) {
        return res.status(404).json({ msg: "Lo sentimos, el password actual no es el correcto" });
    }

    usuarioBDD.password = await usuarioBDD.encrypPassword(passwordnuevo);
    await usuarioBDD.save();

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
    const usuarioBDD = await Usuario.findById(id);
    if (!usuarioBDD) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el usuario con ID: ${id}` });
    }

    if (usuarioBDD.email !== req.body.email) {
        const usuarioBDDMail = await Usuario.findOne({ email: req.body.email });
        if (usuarioBDDMail) {
            return res.status(404).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
        }
    }

    usuarioBDD.nombre = req.body.nombre || usuarioBDD?.nombre;
    usuarioBDD.apellido = req.body.apellido || usuarioBDD?.apellido;
    usuarioBDD.direccion = req.body.direccion || usuarioBDD?.direccion;
    usuarioBDD.telefono = req.body.telefono || usuarioBDD?.telefono;
    usuarioBDD.email = req.body.email || usuarioBDD?.email;

    await usuarioBDD.save();

    res.status(200).json({ msg: "Perfil actualizado correctamente" });
};


export {
    registro,
    login,
    confirmEmail,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword,
    actualizarPassword,
    actualizarPerfil
}