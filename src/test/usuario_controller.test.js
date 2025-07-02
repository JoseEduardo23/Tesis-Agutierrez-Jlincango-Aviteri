import mongoose from "mongoose";
import { generarJWT } from "../helpers/crearJWT.js";
import { sendMailToRecoveryPassword, sendMailToUser } from "../config/nodemailer.js";
import cloudinary from "../config/cloudinary.js";
import Producto from "../models/product_model.js";
import Usuario from "../models/usuario_model.js";
import { registro, login, confirmEmail, recuperarPassword, comprobarTokenPasword, nuevoPassword, perfilUsuario, actualizarPassword, actualizarPerfil, listarUsuarios, eliminarUsuario, obtenerFavoritos, agregarFavorito, eliminarFavorito } from "../controllers/usuario_controller.js";

jest.mock("../models/usuario_model.js");
jest.mock("../models/product_model.js");
jest.mock('../helpers/crearJWT.js', () => ({
    generarJWT: jest.fn(() => 'fake-jwt-token')
}));

jest.mock('../config/nodemailer.js', () => ({
    sendMailToRecoveryPassword: jest.fn(),
    sendMailToUser: jest.fn()
}));
jest.mock("../config/cloudinary.js");


afterEach(() => {
    jest.clearAllMocks();
});

describe("Controladores de Usuario", () => {

    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, file: null };
        res = { status: jest.fn().mockReturnThis(res), json: jest.fn() };
        jest.clearAllMocks();
    });

    describe("registro", () => {
        it("debería retornar error si faltan campos", async () => {
            req.body = { email: "", password: "" }
            await registro(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "Todos los campos son obligatorios" });
        });

        it("debería retornar error si el email ya está registrado", async () => {
            Usuario.findOne.mockResolvedValue(true);
            req.body = { email: "test@test.com", password: "1234" };

            await registro(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("debería registrar un usuario correctamente", async () => {
            Usuario.findOne.mockResolvedValue(null);
            const saveMock = jest.fn();
            const encriptarPasswordMock = jest.fn().mockResolvedValue("hashedPassword");
            const crearTokenMock = jest.fn().mockReturnValue("fakeToken");

            Usuario.mockImplementation(() => ({
                save: saveMock,
                encriptarPassword: encriptarPasswordMock,
                crearToken: crearTokenMock
            }));
            
            sendMailToUser.mockResolvedValue(true);
            req = {
                body: {
                    email: "test@test.com",
                    password: "1234",
                    nombre: "Test",
                    apellido: "User"
                },
                file: {
                    path: "/uploads/test.jpg",
                    filename: "test.jpg"
                }
            };

            await registro(req, res);
            expect(Usuario.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("confirmEmail", () => {
        it("debería retornar error si el token no esiste o es invalido", async () => {
            req.params = {};
            await confirmEmail(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it("debería confirmar correctamente", async () => {
            const saveMock = jest.fn();
            Usuario.findOne.mockResolvedValue({ token: "abc", save: saveMock });
            req.params = { token: "abc" };

            await confirmEmail(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("login", () => {
        it("debería retornar error si hay campos vacíos", async () => {
            req.body = { email: "", password: "" };
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('debería retornar error si no encuentra usuario', async () => {
            jest.spyOn(Usuario, 'findOne').mockImplementation(() => {
                return {
                    select: jest.fn().mockResolvedValueOnce(null)
                };
            });

            req.body = { email: 'test@test.com', password: '1234' };
            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Usuario no registrado' });
        });

        it('debería retornar el token si login es correcto', async () => {

            const usuarioMock = {
                compararPassword: jest.fn().mockResolvedValue(true),
                nombre: 'User',
                apellido: 'Test',
                direccion: 'Dirección',
                telefono: '0999999999',
                _id: new mongoose.Types.ObjectId(),
                email: 'test@test.com',
                confirmEmail: true
            }
            jest.spyOn(Usuario, 'findOne').mockImplementation(() => {
                return {
                    select: jest.fn().mockResolvedValueOnce(usuarioMock)
                };
            });

            req.body = { email: 'test@test.com', password: '123456' };
            await login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                nombre: 'User',
                apellido: 'Test',
                direccion: 'Dirección',
                telefono: '0999999999',
                email: 'test@test.com',
                token: generarJWT(usuarioMock._id),
                _id: usuarioMock._id,
            }));
        });
    });

    describe("recuperarPassword", () => {

        it('debería retornar error si el email está vacío', async () => {
            req.body = { email: '' };
            await recuperarPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Todos los campos son obligatorios" });
        });

        it('debería retornar error si no encuentra al usuario', async () => {
            req.body = { email: 'noexiste@example.com' };
            Usuario.findOne.mockResolvedValue(null);
            await recuperarPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ msg: "Usuario no registrado" });
        });


        it("debería generar token, guardarlo y enviar correo si el email es válido", async () => {
            req.body = { email: 'admin@example.com' };
            const mockUser = {
                crearToken: jest.fn(() => 'fake-token'),
                save: jest.fn(),
                token: null
            };
            Usuario.findOne.mockResolvedValue(mockUser);
            await recuperarPassword(req, res);
            expect(mockUser.crearToken).toHaveBeenCalled();
            expect(sendMailToRecoveryPassword).toHaveBeenCalledWith('admin@example.com', 'fake-token');
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ msg: "Revisa tu correo para restablecer tu contraseña" });
        });
    });

    describe("comprobarTokenPasword", () => {
        it('debería retornar error si no hay token', async () => {
            req.params = {};
            await comprobarTokenPasword(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("debería retornar token válido", async () => {
            Usuario.findOne.mockResolvedValue({ token: "abc" });
            req.params = { token: "abc" };
            await comprobarTokenPasword(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("nuevoPassword", () => {
        it("debería retornar error si no coinciden contraseñas", async () => {
            req.body = { password: "123", confirmpassword: "456" }
            req.params = { token: "abc" };

            await nuevoPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it('debería actualizar password correctamente', async () => {
            req.body = { password: '1234', confirmpassword: '1234' };
            req.params = { token: 'abc' };
            const mockUser = {
                token: 'abc',
                encriptarPassword: jest.fn().mockResolvedValue('hashed'),
                save: jest.fn()
            };
            Usuario.findOne.mockResolvedValue(mockUser);
            await nuevoPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("perfilUsuario", () => {
        it("debería retornar perfil de usuario", () => {
            req.UsuarioBDD = {
                _doc: {
                    nombre: "test",
                    apellido: "apellidoTest",
                    direccion: "a",
                    telefono: "0955214723",
                    estado: true,
                },
                imagen: "url"
            }

            perfilUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                nombre: "test",
                apellido: "apellidoTest",
                direccion: "a",
                telefono: "0955214723",
                estado: true,
                imagen: {
                    url: "url"
                }
            });
        });
    });

    describe("actualizarPassword", () => {
        it('debería retornar error si faltan campos', async () => {
            req.body = { email: '', passwordactual: '', passwordnuevo: '' };
            await actualizarPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });

        it("debería actualizar contraseña correctamente", async () => {

            Usuario.findOne.mockResolvedValue({
                compararPassword: jest.fn().mockResolvedValue(true),
                encriptarPassword: jest.fn().mockResolvedValue("hashedPassword"),
                save: jest.fn()
            });
            req.body = {
                email: "test@test.com",
                passwordactual: "1234",
                passwordnuevo: "5678"
            }

            await actualizarPassword(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("actualizarPerfil", () => {
        it("debería retornar error si el ID es invalido", async () => {
            req.params = { id: "123" };

            await actualizarPerfil(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: "El ID proporcionado no es válido" });
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
            const mockUser = {
                email: 'antiguo@example.com',
                save: jest.fn()
            };
            Usuario.findById.mockResolvedValue(mockUser);
            Usuario.findOne.mockResolvedValue(null);
            await actualizarPerfil(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe("listarUsuarios", () => {
        it('debería retornar listado de usuarios', async () => {
            const usuarioMock = {
                createdAt: new Date(),
                estado: true,
                save: jest.fn()
            };

            const usuariosActualizadosMock = [{ nombre: 'Usuario1' }];

            Usuario.find.mockResolvedValueOnce([usuarioMock]);

            Usuario.find.mockImplementationOnce(() => ({
                select: jest.fn().mockResolvedValueOnce(usuariosActualizadosMock)
            }));
            req = {};

            await listarUsuarios(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(usuariosActualizadosMock);
        });
    });

    describe("eliminarUsuario", () => {
        it("debería eliminar usuario correctamente", async () => {
            Usuario.findByIdAndDelete.mockResolvedValue({ imagen_id: "abc" });
            cloudinary.uploader.destroy.mockResolvedValue({});
            req.params = { id: "123" }

            await eliminarUsuario(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
    describe("obtenerFavoritos", () => {
        it("debería retornar los favoritos del usuario", async () => {
            const usuarioMock = {
                favoritos: ['producto1', 'producto2']
            };

            jest.spyOn(Usuario, 'findById').mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(usuarioMock)
            });

            req.UsuarioBDD = { _id: 'userId123' };
            await obtenerFavoritos(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ favoritos: usuarioMock.favoritos });
        });

    });

    describe("agregarFavorito", () => {
        it('debería agregar producto a favoritos', async () => {
            jest.spyOn(Producto, 'findById').mockResolvedValue(true);
            const usuarioMock = {
                favoritos: [],
                save: jest.fn()
            };
            const usuarioActualizadoMock = {
                favoritos: ['idProductoFav']
            };
            const findByIdMock = jest.spyOn(Usuario, 'findById');
            findByIdMock.mockResolvedValueOnce(usuarioMock).mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(usuarioActualizadoMock)
            });
            req = {
                params: { id: 'productoId' },
                UsuarioBDD: { _id: 'userId' }
            };

            await agregarFavorito(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(usuarioMock.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                msg: "Producto agregado a favoritos",
                favoritos: usuarioActualizadoMock.favoritos
            });
        });

    });

    describe("eliminarFavorito", () => {
        it('debería eliminar favorito correctamente', async () => {
            const usuarioMock = {
                favoritos: ['productoId'],
                save: jest.fn()
            };

            const usuarioActualizadoMock = {
                favoritos: []
            };

            const findByIdMock = jest.spyOn(Usuario, 'findById');

            findByIdMock.mockResolvedValueOnce(usuarioMock);

            findByIdMock.mockReturnValueOnce({
                populate: jest.fn().mockResolvedValueOnce(usuarioActualizadoMock)
            });

            req = { params: { id: 'productoId' }, UsuarioBDD: { _id: 'userId' } };

            await eliminarFavorito(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(usuarioMock.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                msg: "Producto eliminado de favoritos",
                favoritos: usuarioActualizadoMock.favoritos
            });
        });
    });
});

