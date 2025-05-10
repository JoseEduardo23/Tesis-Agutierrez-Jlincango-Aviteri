import Producto from "../models/product_model.js";
import mongoose from 'mongoose';
import ImageService from "../services/imageService.js";
import fs from 'fs-extra'

const registrarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    // Validación mejorada
    if (!nombre || !precio || !stock || !categoria) {
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

    let imagenData = {};
    if (req.file) {
      try {
        imagenData.imagen = await ImageService.uploadImage(
          req.file.path,
          "productos",
          { width: 800, crop: "scale" }
        );
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error al procesar la imagen",
          error: error.message
        });
      }
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion: descripcion || null,
      precio: Number(precio),
      stock: Number(stock),
      categoria: categoria.toLowerCase(),
      ...imagenData
    });

    await nuevoProducto.save();

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: {
        _id: nuevoProducto._id,
        nombre: nuevoProducto.nombre,
        imagen: nuevoProducto.imagen,
        descripcion: nuevoProducto.descripcion,
        precio: nuevoProducto.precio,
        stock: nuevoProducto.stock,
        categoria: nuevoProducto.categoria
      }
    });

  } catch (error) {
    console.error("Error en registrarProducto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno al crear el producto",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const listarProductos = async (req, res) => {
  try {
    const { categoria } = req.query;
    const filtro = categoria ? { categoria: categoria.toLowerCase() } : {};

    const productos = await Producto.find(filtro)
      .sort({ createdAt: -1 })
      .select('-__v -updatedAt');

    if (productos.length === 0) {
      return res.status(200).json({ 
        msg: "No hay productos registrados",
        filtro: categoria ? `Categoría: ${categoria}` : null
      });
    }

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error en listarProductos:", error);
    res.status(500).json({ 
      msg: "Error al obtener productos", 
      error: error.message 
    });
  }
};

const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      msg: "ID inválido",
      idRecibido: id 
    });
  }

  try {
    const producto = await Producto.findById(id).select('-__v -updatedAt');

    if (!producto) {
      return res.status(404).json({ 
        msg: "Producto no encontrado",
        idBuscado: id 
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error en obtenerProductoPorId:", error);
    res.status(500).json({ 
      msg: "Error al obtener producto", 
      error: error.message 
    });
  }
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      msg: "ID inválido",
      idRecibido: id 
    });
  }

  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ 
        msg: "Producto no encontrado",
        idBuscado: id 
      });
    }

    // Manejo de imagen
    if (req.file) {
      try {
        producto.imagen = await ImageService.updateImage(
          producto.imagen?.public_id,
          req.file.path,
          "productos",
          { width: 800, crop: "scale" }
        );
      } catch (error) {
        return res.status(500).json({ 
          msg: "Error al actualizar la imagen del producto", 
          error: error.message 
        });
      }
    }

    // Actualizar otros campos
    if (req.body.nombre) producto.nombre = req.body.nombre;
    if (req.body.descripcion !== undefined) producto.descripcion = req.body.descripcion;
    if (req.body.precio) producto.precio = Number(req.body.precio);
    if (req.body.stock) producto.stock = Number(req.body.stock);
    if (req.body.categoria) producto.categoria = req.body.categoria.toLowerCase();

    await producto.save();
    
    res.status(200).json({ 
      msg: "Producto actualizado con éxito",
      producto: {
        _id: producto._id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,
        updatedAt: producto.updatedAt
      }
    });
  } catch (error) {
    console.error("Error en actualizarProducto:", error);
    res.status(500).json({ 
      msg: "Error al actualizar producto", 
      error: error.message 
    });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      msg: "ID inválido",
      idRecibido: id 
    });
  }

  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ 
        msg: "Producto no encontrado",
        idBuscado: id 
      });
    }

    // Eliminar imagen si existe
    if (producto.imagen?.public_id) {
      try {
        await ImageService.deleteImage(producto.imagen.public_id);
      } catch (error) {
        console.error("Error al eliminar imagen:", error);
      }
    }

    await producto.deleteOne();
    
    res.status(200).json({ 
      msg: "Producto eliminado con éxito",
      productoEliminado: {
        _id: producto._id,
        nombre: producto.nombre
      }
    });
  } catch (error) {
    console.error("Error en eliminarProducto:", error);
    res.status(500).json({ 
      msg: "Error al eliminar producto", 
      error: error.message 
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