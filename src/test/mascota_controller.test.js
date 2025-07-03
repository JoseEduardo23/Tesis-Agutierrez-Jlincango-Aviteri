import mongoose from 'mongoose';
import Mascota from '../models/mascota_model.js';
import cloudinary from '../config/cloudinary.js';
import { registrarMascota, listarMascotas, detalleMascota, actualizarMascota, eliminarMascota, generarDieta } from '../controllers/mascota_controler.js';
import { GoogleGenAI } from '@google/genai';

jest.mock('../models/mascota_model.js');
jest.mock('../config/cloudinary.js');
jest.mock('@google/genai');

describe('Controlador de Mascotas', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, file: null, UsuarioBDD: { _id: new mongoose.Types.ObjectId() } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.clearAllMocks();
    });

    describe('registrarMascota', () => {
        it('debería retornar error si hay campos vacíos', async () => {
            req.body = {
                nombre: '',
                raza: '',
                edad: '',
                actividad: '',
                peso: '',
                enfermedades: ''
            };
            await registrarMascota(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Todos los campos son obligatorios' });
        });

        it('debería registrar mascota correctamente', async () => {
            req.body = { 
                nombre: 'Firulais', 
                raza: 'Labrador', 
                edad: '5', 
                actividad: 'Alta', 
                peso: '30', 
                enfermedades: 'Ninguna' 
            };
            Mascota.mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));
            await registrarMascota(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('listarMascotas', () => {
        it('debería listar mascotas correctamente', async () => {
            Mascota.find.mockReturnValue({ select: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue([]) }) });
            await listarMascotas(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('detalleMascota', () => {
        it('debería retornar error si ID inválido', async () => {
            req.params.id = '123';
            await detalleMascota(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('actualizarMascota', () => {
        it('debería retornar error si hay campos vacíos', async () => {
            req.params.id = new mongoose.Types.ObjectId();
            req.body = { 
                nombre: '', 
                raza: '', 
                edad: '', 
                actividad: '', 
                peso: '', 
                enfermedades: ''
            };
            await actualizarMascota(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('eliminarMascota', () => {
        it('debería retornar error si ID inválido', async () => {
            req.params.id = '123';
            await eliminarMascota(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('generarDieta', () => {
        it('debería retornar error si presupuesto no válido', async () => {
            req.params.id = new mongoose.Types.ObjectId();
            req.body.presupuesto = 'Otro';
            await generarDieta(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
