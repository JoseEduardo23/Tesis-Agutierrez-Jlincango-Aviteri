import mongoose from 'mongoose';
import Producto from '../models/product_model.js';
import cloudinary from '../config/cloudinary.js';
import { registrarProducto, listarProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto, listarProductosPublicos } from '../controllers/product_controller.js';

jest.mock('../models/product_model.js');
jest.mock('../config/cloudinary.js');

describe('Controlador de Productos', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, file: null };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    describe('registrarProducto', () => {
        it('debería retornar error si hay campos vacíos', async () => {
            req.body = { 
                nombre: '', 
                descripcion: '', 
                precio: '', 
                stock: '', 
                categoria: '' 
            };
            await registrarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
        });

        it('debería retornar error si la categoría es inválida', async () => {
            req.body = { 
                nombre: 'Collar', 
                descripcion: 'Para perro', 
                precio: '10', 
                stock: '5', 
                categoria: 'Vacas' 
            };
            Producto.findOne.mockResolvedValue(null);
            await registrarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debería registrar producto correctamente', async () => {
            req.body = { 
                nombre: 'Collar', 
                descripcion: 'Para perro', 
                precio: '10', 
                stock: '5', 
                categoria: 'Perros' 
            };
            Producto.findOne.mockResolvedValue(null);
            Producto.mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));
            await registrarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('listarProductos', () => {
        it('debería retornar mensaje si no hay productos', async () => {
            Producto.find.mockResolvedValue([]);
            await listarProductos(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: 'No hay productos registrados por el momento' });
        });

        it('debería listar productos correctamente', async () => {
            Producto.find.mockResolvedValue([{}]);
            await listarProductos(req, res);
            expect(res.json).toHaveBeenCalledWith([{}]);
        });
    });

    describe('obtenerProductoPorId', () => {
        it('debería retornar error si ID inválido', async () => {
            req.params.id = '123';
            await obtenerProductoPorId(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debería retornar error si producto no existe', async () => {
            req.params.id = new mongoose.Types.ObjectId();
            Producto.findById.mockResolvedValue(null);
            await obtenerProductoPorId(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('actualizarProducto', () => {
        it('debería retornar error si hay campos vacíos', async () => {
            req.params.id = new mongoose.Types.ObjectId();
            req.body = { 
                nombre: '', 
                descripcion: '', 
                precio: '', 
                stock: '', 
                categoria: ''
            };
            await actualizarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debería retornar error si producto no existe', async () => {
            req.params.id = new mongoose.Types.ObjectId();
            req.body = { 
                nombre: 'Pelota', 
                descripcion: 'Para perro', 
                precio: '5', 
                stock: '10', 
                categoria: 'Perros' 
            };
            Producto.findById.mockResolvedValue(null);
            await actualizarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('eliminarProducto', () => {
        it('debería retornar error si ID inválido', async () => {
            req.params.id = '123';
            await eliminarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('debería retornar error si producto no existe', async () => {
            req.params.id = new mongoose.Types.ObjectId();
            Producto.findById.mockResolvedValue(null);
            await eliminarProducto(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('listarProductosPublicos', () => {
        it('debería listar productos públicos correctamente', async () => {
            Producto.find.mockResolvedValue([{}]);
            await listarProductosPublicos(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});