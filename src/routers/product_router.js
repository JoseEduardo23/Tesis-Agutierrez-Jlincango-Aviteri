import { Router } from "express";
import { registrarProducto, listarProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto, } from "../controllers/product_controller.js";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { validacionProducto } from "../middlewares/productos_validations.js";
import { uploadProductos } from "../middlewares/upload_cloudinary.js"
const router = Router();

router.post("/crear/producto", verificarAutenticacion,uploadProductos.single("imagen"), validacionProducto, registrarProducto);
router.get("/listar/productos", listarProductos);
router.get("/detalle/producto/:id", verificarAutenticacion, obtenerProductoPorId);
router.put("/actualizar/producto/:id", verificarAutenticacion, uploadProductos.single("imagen"), actualizarProducto);
router.delete("/eliminar/producto/:id", verificarAutenticacion, eliminarProducto);

export default router;