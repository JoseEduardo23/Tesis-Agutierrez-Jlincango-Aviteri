import { Router } from "express";
import { registrarProducto, listarProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto, listarProductosPublicos, } from "../controllers/product_controller.js";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { validacionProducto } from "../middlewares/productos_validations.js";
import { uploadProductos } from "../middlewares/upload_cloudinary.js"
const router = Router();

router.post("/producto/crear", verificarAutenticacion,uploadProductos.single("imagen"), validacionProducto, registrarProducto);
router.get("/productos/listar", verificarAutenticacion, listarProductos);
router.get("/producto/detalle/:id", verificarAutenticacion, obtenerProductoPorId);
router.put("/producto/actualizar/:id", verificarAutenticacion, uploadProductos.single("imagen"), validacionProducto, actualizarProducto);
router.delete("/producto/eliminar/:id", verificarAutenticacion, eliminarProducto);
router.get("/productos/publico", listarProductosPublicos)
export default router;