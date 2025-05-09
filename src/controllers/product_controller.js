import Producto from "../models/product_model.js";
import mongoose from 'mongoose';
import cloudinary from "../config/cloudinary.js";

const registrarProducto = async (req, res) => {
    console.log("Archivo recibido:", req.file);  // Verifica si el archivo llega
    console.log("Cuerpo de la solicitud:", req.body);
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    try {
        // 1. Validar campos requeridos
        const camposRequeridos = { nombre, precio, stock, categoria };
        const camposFaltantes = Object.entries(camposRequeridos)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                msg: "Campos obligatorios faltantes",
                campos: camposFaltantes
            });
        }

        // 2. Validar categoría (insensible a mayúsculas)
        const categoriasValidas = ["perros", "gatos", "peces", "aves"];
        const categoriaNormalizada = categoria.toLowerCase();

        if (!categoriasValidas.includes(categoriaNormalizada)) {
            return res.status(400).json({
                msg: "Categoría inválida",
                categoriasValidas
            });
        }

        // 3. Verificar producto existente
        const productoExistente = await Producto.findOne({
            nombre: { $regex: new RegExp(nombre, 'i') }
        });

        if (productoExistente) {
            return res.status(400).json({
                msg: "El producto ya existe",
                productoExistente: productoExistente.nombre
            });
        }

        let imagenData = {};
        if (req.file) {
            if (!req.file.secure_url || !req.file.public_id) {
                throw new Error("Cloudinary no devolvió los datos esperados");
            }

            imagenData = {
                imagen: req.file.secure_url,
                imagen_id: req.file.public_id
            };
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio: Number(precio),
            stock: Number(stock),
            categoria: categoria.toLowerCase(),
            ...imagenData
        });

        await nuevoProducto.save();

        res.status(201).json({
            msg: "Producto creado con éxito",
            producto: nuevoProducto
        });

    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            stack: error.stack,
            request: {
                body: req.body,
                file: req.file
            }
        });
    }
}

const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.find();

        if (productos.length === 0) {
            return res.status(200).json({ msg: "No hay productos registrados por el momento" });
        }

        return res.json(productos);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Error al obtener productos", error: error.message });
    }
}

const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido" });
    }

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener producto", error: error.message });
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria, } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido" });
    }

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        if (req.file) {
            if (producto.imagen_id) {
                await cloudinary.uploader.destroy(producto.imagen_id);
            }
            producto.imagen = req.file.source_url;
            producto.imagen_id = req.file.filename;
        }

        producto.nombre = nombre || producto.nombre;
        producto.descripcion = descripcion || producto.descripcion;
        producto.precio = precio || producto.precio;
        producto.stock = stock || producto.stock;
        producto.categoria = categoria || producto.categoria;

        await producto.save();
        res.status(200).json({ msg: "Producto actualizado con éxito", producto });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar producto", error: error.message });
    }
};

const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID inválido" });
    }

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }
        if (producto.imagen_id) {
            await cloudinary.uploader.destroy(producto.imagen_id);
        }

        await producto.deleteOne();
        res.status(200).json({ msg: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar producto", error: error.message });
    }
};

export {
    registrarProducto,
    listarProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
};
