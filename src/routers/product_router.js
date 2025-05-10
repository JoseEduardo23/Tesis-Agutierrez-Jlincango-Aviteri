import { Router } from "express";
import { registrarProducto, listarProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto, } from "../controllers/product_controller.js";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { validacionProducto } from "../middlewares/productos_validations.js";
import uploadErrorHandler from '../middlewares/uploadErrorHandler.js'
import uploadProductImage from '../config/uploadProductImages.js'

const router = Router();

router.post("/crear/producto", verificarAutenticacion, uploadProductImage, uploadErrorHandler, validacionProducto, registrarProducto);
router.get("/listar/productos", listarProductos);
router.get("/detalle/producto/:id", verificarAutenticacion, obtenerProductoPorId);
router.put("/actualizar/producto/:id", verificarAutenticacion, uploadProductos.single("imagen"), actualizarProducto);
router.delete("/eliminar/producto/:id", verificarAutenticacion, validacionProducto, eliminarProducto);

export default router;