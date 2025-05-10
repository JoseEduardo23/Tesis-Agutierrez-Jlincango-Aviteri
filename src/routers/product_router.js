import { Router } from "express";
import { registrarProducto, listarProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto, } from "../controllers/product_controller.js";
import { verificarAutenticacion, verificarRolAdmin } from "../helpers/crearJWT.js";
import { validacionProducto } from "../middlewares/productos_validations.js";
import uploadErrorHandler from "../middlewares/uploadErrorHandler.js";
import uploadProductImage from "../config/uploadProductImages.js";

const router = Router();

// Crear producto (manteniendo ruta original)
router.post("/crear/producto",
  verificarAutenticacion,
  verificarRolAdmin,
  uploadProductImage,
  uploadErrorHandler,
  validacionProducto,
  registrarProducto
);

router.get("/listar/productos", listarProductos);

router.get("/detalle/producto/:id",
  obtenerProductoPorId
);

router.put("/actualizar/producto/:id",
  verificarAutenticacion,
  verificarRolAdmin,
  uploadProductImage,
  uploadErrorHandler,
  validacionProducto,
  actualizarProducto
);

router.delete("/eliminar/producto/:id",
  verificarAutenticacion,
  verificarRolAdmin,
  eliminarProducto
);

export default router;
