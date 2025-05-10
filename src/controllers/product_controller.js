import Producto from "../models/product_model.js";
import mongoose from 'mongoose';
import ImageService from "../services/imageService.js";
import fs from 'fs-extra'

const handleImageUpload = async (file, existingPublicId = null) => {
  if (!file) return null;
  
  try {
    await fs.access(file.path);
    const result = existingPublicId 
      ? await ImageService.updateImage(existingPublicId, file.path, "productos", { width: 800, crop: "scale" })
      : await ImageService.uploadImage(file.path, "productos", { width: 800, crop: "scale" });
    
    await fs.unlink(file.path);
    return result;
  } catch (error) {
    await fs.unlink(file.path).catch(() => {});
    throw error;
  }
};

const registrarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    // Validación básica
    if (!nombre || !precio || !stock || !categoria) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ 
        success: false,
        message: "Faltan campos obligatorios",
        missingFields: {
          nombre: !nombre,
          precio: !precio,
          stock: !stock,
          categoria: !categoria
        }
      });
    }

    const imagen = await handleImageUpload(req.file);

    const nuevoProducto = new Producto({
      nombre,
      descripcion: descripcion || null,
      precio: Number(precio),
      stock: Number(stock),
      categoria: categoria.toLowerCase(),
      imagen
    });

    await nuevoProducto.save();

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: nuevoProducto.toObject({ getters: true, versionKey: false })
    });

  } catch (error) {
    console.error("Error en registrarProducto:", error);
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    
    res.status(500).json({
      success: false,
      message: "Error al crear producto",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listarProductos = async (req, res) => {
  try {
    const { categoria, page = 1, limit = 10 } = req.query;
    const filtro = categoria ? { categoria: categoria.toLowerCase() } : {};
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: '-__v -updatedAt'
    };

    const result = await Producto.paginate(filtro, options);

    res.status(200).json({
      success: true,
      data: {
        productos: result.docs,
        total: result.totalDocs,
        pages: result.totalPages,
        currentPage: result.page
      }
    });
  } catch (error) {
    console.error("Error en listarProductos:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener productos",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID de producto inválido"
      });
    }

    const producto = await Producto.findById(req.params.id).select('-__v -updatedAt');
    if (!producto) {
      return res.status(404).json({ 
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error("Error en obtenerProductoPorId:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener producto",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ 
        success: false,
        message: "ID de producto inválido"
      });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      if (req.file) await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ 
        success: false,
        message: "Producto no encontrado"
      });
    }

    // Manejo de imagen
    if (req.file) {
      producto.imagen = await handleImageUpload(req.file, producto.imagen?.public_id);
    }

    // Actualizar campos
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    if (nombre) producto.nombre = nombre;
    if (descripcion !== undefined) producto.descripcion = descripcion;
    if (precio) producto.precio = Number(precio);
    if (stock) producto.stock = Number(stock);
    if (categoria) producto.categoria = categoria.toLowerCase();

    await producto.save();
    
    res.status(200).json({
      success: true,
      message: "Producto actualizado con éxito",
      data: producto.toObject({ getters: true, versionKey: false })
    });
  } catch (error) {
    console.error("Error en actualizarProducto:", error);
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    
    res.status(500).json({ 
      success: false,
      message: "Error al actualizar producto",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "ID de producto inválido"
      });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ 
        success: false,
        message: "Producto no encontrado"
      });
    }

    // Eliminar imagen si existe
    if (producto.imagen?.public_id) {
      await ImageService.deleteImage(producto.imagen.public_id).catch(error => {
        console.error("Error al eliminar imagen de Cloudinary:", error);
      });
    }

    await producto.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Producto eliminado con éxito",
      data: { _id: producto._id }
    });
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al eliminar producto",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  registrarProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};