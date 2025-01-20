import Producto from "../models/product_model.js";
import mongoose from 'mongoose';

const crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

    // Validar campos
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    try {
        const nuevoProducto = new Producto({ nombre, descripcion, precio, stock, categoria, imagen });
        await nuevoProducto.save();
        res.status(201).json({ msg: "Producto creado con éxito", producto: nuevoProducto });
    } catch (error) {
        res.status(500).json({ msg: "Error al crear producto", error });
    }
};

const listarProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener productos", error });
    }
};

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
        res.status(500).json({ msg: "Error al obtener producto", error });
    }
};

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria,imagen } = req.body;

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

        producto.nombre = nombre || producto.nombre;
        producto.descripcion = descripcion || producto.descripcion;
        producto.precio = precio || producto.precio;
        producto.stock = stock || producto.stock;
        producto.categoria = categoria || producto.categoria;
        producto.imagen = imagen || producto.imagen; 

        await producto.save();
        res.status(200).json({ msg: "Producto actualizado con éxito", producto });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar producto", error });
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

        await producto.deleteOne();
        res.status(200).json({ msg: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar producto", error });
    }
};

export {
    crearProducto,
    listarProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto,
};
