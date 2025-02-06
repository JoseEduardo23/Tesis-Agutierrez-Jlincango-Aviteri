import jwt from 'jsonwebtoken'
import Administrador from '../models/admin_model.js'
import Usuario from '../models/usuario_model.js';
import dotenv from "dotenv"

dotenv.config()

const generarJWT = (id, rol) =>{
    return jwt.sign({id, rol},process.env.JWT_SECRET,{expiresIn:'3d'})
}
const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "Debe proporcionar un token" }); 
    }

    const { authorization } = req.headers;
    try {
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        if (rol === "Administrador") {
            req.AdministradorBDD = await Administrador.findById(id).lean().select("-password");
            next();
        } else {
            req.UsuarioBDD = await Usuario.findById(id).lean().select("-password");
            //console.log(req.UsuarioBDD);
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ msg: "Formato del token no válido" }); 
    }
};



export {
    verificarAutenticacion,
    generarJWT
}

