import { Router } from "express";
import {crearProducto,listarProductos,obtenerProductoPorId,actualizarProducto,eliminarProducto,} from "../controllers/product_controller.js";
import { verificarAutenticacion } from "../helpers/crearJWT.js";
import { validacionProducto } from "../middlewares/productos_validations.js";
const router = Router();

router.post("/crear/producto", verificarAutenticacion, validacionProducto, crearProducto);
router.get("/listar/productos", listarProductos);
router.get("/detalle/producto/:id", verificarAutenticacion, obtenerProductoPorId);
router.put("/actualizar/producto/:id", verificarAutenticacion, actualizarProducto);
router.delete("/eliminar/producto/:id", verificarAutenticacion, eliminarProducto);

export default router;
