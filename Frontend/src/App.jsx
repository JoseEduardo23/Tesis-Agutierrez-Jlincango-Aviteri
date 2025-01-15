import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './paginas/landingPage'
import Auth from './layout/Auth'
import Login from './paginas/Login'
import { Register } from './paginas/Register'
import { AuthProvider } from './Context/AuthProvider'

function App() {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route index element={<LandingPage />} />

                        <Route path='/' element={<Auth />}>
                            <Route path='login' element={<Login />} />
                            <Route path='register' element={<Register />} />

                        </Route>

                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}
export default App
