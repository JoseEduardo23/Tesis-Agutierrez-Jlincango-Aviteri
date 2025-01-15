import { Navigate } from "react-router-dom";
export const PrivateRoute = ({children})=>{
    const autenticado = localStorage.getItem("token")
    return (autenticado) ? children : <Navigate to="/dashboard"/>
}