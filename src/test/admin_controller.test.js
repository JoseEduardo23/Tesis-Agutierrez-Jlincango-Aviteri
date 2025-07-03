import mongoose from 'mongoose';
import Administrador from '../models/admin_model.js';
import { sendMailToRecoveryPassword } from '../config/nodemailer.js';
import {login, recuperarPassword,comprobarTokenPasword, nuevoPassword,perfilAdministrador, actualizarPassword,actualizarPerfil} from '../controllers/admin_controler.js';
import { generarJWT } from '../helpers/crearJWT.js';
jest.mock('../models/admin_model.js', () => ({
	findOne: jest.fn(),
	findById: jest.fn()
}));

jest.mock('../config/nodemailer.js', () => ({
	sendMailToRecoveryPassword: jest.fn()
}));

jest.mock('../helpers/crearJWT.js', () => ({
	generarJWT: jest.fn(() => 'fake-jwt-token')
}));

afterEach(() => {
	jest.clearAllMocks();
});

describe('Controlador de Administrador', () => {
	let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, file: null };
        res = { status: jest.fn().mockReturnThis(res), json: jest.fn() };
        jest.clearAllMocks();
    });

	describe('login', () => {

		it("debería retornar error si hay campos vacíos", async () => {
			req.body = { email: "", password: "" };
			await login(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('debería retornar error si no encuentra administrador', async () => {
			jest.spyOn(Administrador, 'findOne').mockImplementation(() => {
				return {
					select: jest.fn().mockResolvedValueOnce(null)
				};
			});

			req.body = {email: 'test@test.com', password: '123456aA_'}
			await login(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ msg: 'El Administrador no se encuentra registrado' });
		});

		it('debería retornar el token si login es correcto', async () => {
			const administradorMock = {
				matchPassword: jest.fn().mockResolvedValue(true),
				nombre: 'Admin',
				apellido: 'Test',
				direccion: 'Dirección',
				telefono: '0999999999',
				_id: new mongoose.Types.ObjectId(),
				email: 'test@test.com',
			};

			jest.spyOn(Administrador, 'findOne').mockImplementation(() => {
				return {
					select: jest.fn().mockResolvedValueOnce(administradorMock)
				};
			});

			req.body = { email: 'test@test.com', password: '123456' };
			await login(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
				nombre: administradorMock.nombre,
				apellido: administradorMock.apellido,
				direccion: administradorMock.direccion,
				telefono: administradorMock.telefono,
				token: generarJWT(administradorMock._id),
				_id: administradorMock._id,
				msg: "Bienvenido al sistema de administración de Tiendanimal"
			}));
		});
	});

	describe('recuperarPassword', () => {
		it('debería retornar error si el email está vacío', async () => {
			req.body = { email: '' };
			await recuperarPassword(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ msg: "Debes llenar el campo correctamente" });
		});

		it('debería retornar error si no encuentra al administrador', async () => {
			req.body = { email: 'noexiste@example.com' };
			Administrador.findOne.mockResolvedValue(null);
			await recuperarPassword(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el Administrador no se encuentra registrado" });
		});

		it('debería generar token, guardarlo y enviar correo si el email es válido', async () => {
			req.body = { email: 'admin@example.com' };
			const mockAdmin = {
				crearToken: jest.fn(() => 'fake-token'),
				save: jest.fn(),
				token: null
			};
			Administrador.findOne.mockResolvedValue(mockAdmin);
			await recuperarPassword(req, res);
			expect(mockAdmin.crearToken).toHaveBeenCalled();
			expect(sendMailToRecoveryPassword).toHaveBeenCalledWith('admin@example.com', 'fake-token');
			expect(mockAdmin.save).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
		});
	});

	describe('comprobarTokenPasword', () => {
		it('debería retornar error si no hay token', async () => {
			req.params = {};
			await comprobarTokenPasword(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
		});
		
		it('debería retornar error ya que el token expiro', async () => {
			Administrador.findOne.mockResolvedValue({ token: 'abc123', 
				tokenExpiracion: Date.now() - 360, 
				save: jest.fn() 
			});
			req.params = { token: 'abc123' };
			await comprobarTokenPasword(req, res);
			expect(res.status).toHaveBeenCalledWith(403);
		});

		it('debería confirmar token válido', async () => {
			Administrador.findOne.mockResolvedValue({ token: 'abc123', 
				tokenExpiracion: Date.now() + 3600000, 
				save: jest.fn() 
			});
			req.params = { token: 'abc123' };
			await comprobarTokenPasword(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

	describe('nuevoPassword', () => {
		it('debería retornar error si los passwords no coinciden', async () => {
			req.body = { password: '1234', confirmpassword: '4321' };
			req.params = { token: 'abc' };
			await nuevoPassword(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('debería actualizar password correctamente', async () => {
			req.body = { password: 'Contraseña1_', confirmpassword: 'Contraseña1_' };
			req.params = { token: 'abc' };
			const mockAdmin = {
				token: 'abc',
				encrypPassword: jest.fn().mockResolvedValue('hashed'),
				tokenExpiracion: Date.now() + 3600000,
				matchPassword: jest.fn().mockResolvedValue(false), 
				save: jest.fn()
			};
			Administrador.findOne.mockResolvedValue(mockAdmin);
			await nuevoPassword(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

	describe('perfilAdministrador', () => {
		it('debería retornar el perfil', () => {
			req.AdministradorBDD = {
				nombre: 'Test',
				apellido: 'User',
				estado: true,
			};
			perfilAdministrador(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				nombre: 'Test',
				apellido: 'User',	
				estado: true,
			});
		});
	});

	describe('actualizarPassword', () => {
		it('debería retornar error si faltan campos', async () => {
			req.body = { email: '', passwordactual: '', passwordnuevo: '' };
			await actualizarPassword(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
		});

		it('debería actualizar contraseña correctamente', async () => {
			req.body = { 
				email: 'test@test.com', 
				passwordactual: 'Contraseña1_', 
				passwordnuevo: 'ContraseñaNueva1_'
			};
			req.AdministradorBDD = { email: 'test@test.com' }
			const mockAdmin = {
				email: 'test@test.com',
				matchPassword: jest.fn().mockResolvedValue(true),
				encrypPassword: jest.fn().mockResolvedValue('hashed'),
				save: jest.fn()
			};
			Administrador.findOne.mockResolvedValue(mockAdmin);
			await actualizarPassword(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

	describe('actualizarPerfil', () => {
		it('debería retornar error si id no es válido', async () => {
			req.params.id = 'invalid-id';
			await actualizarPerfil(req, res);
			expect(res.status).toHaveBeenCalledWith(404);
		});

		it('debería actualizar perfil correctamente', async () => {
			req.params.id = new mongoose.Types.ObjectId();
			req.body = {
				nombre: 'Nuevo',
				apellido: 'Apellido',
				direccion: 'Dirección',
				telefono: '1234',
				email: 'nuevo@example.com'
			};
			const mockAdmin = {
				email: 'antiguo@example.com',
				save: jest.fn()
			};
			Administrador.findById.mockResolvedValue(mockAdmin);
			Administrador.findOne.mockResolvedValue(null);
			await actualizarPerfil(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
		});
	});

});
