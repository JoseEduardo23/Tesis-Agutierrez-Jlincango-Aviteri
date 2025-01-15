import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../components/Alertas/Mensaje';
import '../Estilos/Register.css'
import { toast, ToastContainer } from 'react-toastify';

export const Register = () => {

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:3000/api/registro";
            const respuesta = await axios.post(url, form);
            toast.success(respuesta.data.msg)
            console.log(respuesta);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || 'Ha ocurrido un error, intentelo de nuevo')
        }
    };

    return (
        <>
            <div className="container">
                {Object.keys(mensaje).length > 0 && (
                    <div className={`message ${mensaje.tipo}`}>
                        {mensaje.respuesta}
                    </div>
                )}
                <div className="form-container">

                    <h1 className="title">Welcome</h1>
                    <small className="subtitle">Please enter your details</small>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="nombre">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={form.nombre || ""}
                                onChange={handleChange}
                                placeholder="Ingresa tu nombre"
                                className="input"
                                
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="apellido">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={form.apellido || ""}
                                onChange={handleChange}
                                placeholder="Ingresa tu apellido"
                                className="input"
                                
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="direccion">Dirección</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={form.direccion || ""}
                                onChange={handleChange}
                                placeholder="Ingresa tu dirección"
                                className="input"
                                
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="telefono">Teléfono:</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={form.telefono || ""}
                                onChange={handleChange}
                                placeholder="Ingresa tu teléfono"
                                className="input"
                                
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email || ""}
                                onChange={handleChange}
                                placeholder="Ingresa tu email"
                                className="input"
                                
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-sm font-semibold" htmlFor="password">Contraseña:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password || ""}
                                onChange={handleChange}
                                className="input"
                                
                            />
                        </div>

                        <div className="mb-3">
                            <button className="button">Register</button>
                        </div>

                    </form>

                    <div className="link-container">
                        <p>You've already an account?</p>
                        <Link to="/login" className="link">Login</Link>
                    </div>

                </div>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={true} />
        </>
    );
};