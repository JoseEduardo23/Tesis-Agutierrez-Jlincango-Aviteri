import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage} from './paginas/landingPage'

function App(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route index element={<LandingPage/>}/>
            </Routes>
        </BrowserRouter>
        </>
    )
}
export default App
