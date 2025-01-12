import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '/src/Estilos/landinPage.css';
import logo1 from '../assets/code.png'


export const LandingPage = () => {
  const [darkMode, setdarkMode] = useState(false)
  return (
    <div className={darkMode ? "dark" : ""}>

      <main class="">
        <section>
          <nav class="">
            <h1 class="">TiendAnimal</h1>
            <ul class="">
              <li><img onclick="" /></li>
              <img className='logo1' src={logo1} alt="Logo" />
              <li><a href="">Login</a></li>
            </ul>
          </nav>
        </section>
      </main>

    </div>
  )
}
