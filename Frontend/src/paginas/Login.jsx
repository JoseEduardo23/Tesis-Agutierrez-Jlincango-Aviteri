import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../Context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import '../Estilos/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:3000/api/login`;
            const respuesta = await axios.post(url, form);
            localStorage.setItem('token, respuesta.data.token');
            setAuth(respuesta.data);
            toast.success('Inicio de sesión exitoso');
            navigate('/dashboard');
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || 'Ha ocurrido un error. Inténtalo de nuevo';
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="login-container">
                <div className="login-image"></div>
                <div className="login-form-container">
                    <div className="login-form">
                        <h1 className="login-title">BIENVENIDO</h1>
                        <small className="login-subtitle">
                            Bienvenido de vuelta, por favor ingresa tus datos.
                        </small>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="input-field"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Tu contraseña"
                                    className="input-field"
                                />
                            </div>

                            <div className="button-group">
                                <button type="submit" className="btn-primary">
                                    Login
                                </button>
                            </div>
                        </form>

                        <div className="divider">
                            <hr />
                            <p className="divider-text">OR</p>
                            <hr />
                        </div>

                        <button className="btn-google">
                            <img
                                className="btn-icon"
                                src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                                alt="Google Icon"
                            />
                            Sign in with Google
                        </button>

                        <button className="btn-facebook">
                            <img
                                className="btn-icon"
                                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                                alt="Facebook Icon"
                            />
                            Sign in with Facebook
                        </button>

                        <div className="forgot-password">
                            <Link to="/forgot/id" className="forgot-link">
                                Forgot your password?
                            </Link>
                        </div>

                        <div className="register-link">
                            <p>Don't have an account?</p>
                            <Link to="/register" className="btn-secondary">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;