import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Estilos/landinPage.css';
import logoDarkMode from '../assets/dark.png';
import img2 from '../assets/fondo1.jpg'
import img3 from '../assets/game.png'
import img4 from '../assets/food.png'
import img5 from '../assets/thing.png'
import img6 from '../assets/github.png'
import img7 from '../assets/facebook.png'
import img8 from '../assets/twitter.png'
import img9 from '../assets/robot.png'
import img10 from '../assets/phone.png'
import img11 from '../assets/mail.png'
import img12 from '../assets/ubi.png'
import img13 from '../assets/fondo2.jpg'
import img14 from '../assets/fondo3.jpg'
import img15 from '../assets/cat.png'




export const LandingPage = () => {
  const [darkMode, setdarkMode] = useState(false)
  return (
    <div className={darkMode ? "dark" : ""}>

      <main>
        <section>
          <nav className="barra1">
            <h1 className="title1">TiendAnimal</h1>
            <ul>
              <li className='C'>Conocenos</li>
              <li className='C'>Planes alimenticos</li>
              <li className='C'>Contactanos</li>
              <li>
                <img
                  onClick={() => setdarkMode(!darkMode)}
                  className="img1"
                  src={logoDarkMode}
                  alt="logo"
                />
              </li>
              <li><Link to="/login" className='bg-gray-600 text-slate-400 px-6 py-2 rounded-full ml-8 hover:bg-gray-900 hover:text-white' href="#">Login</Link></li>
              </ul>
          </nav>
        </section>
        <section className='section2'>
          <div className='divContainer'>
            <div className='texto1'>
              <h2>
                ¿Que es el bienestar animal? <br /> <br />
              </h2>
              <p>
                En la actualidad el bienestar animal de nuestras mascotas, se trata de una cuestión que ha adquirido una enorme importancia en nuestra sociedad, no se trata unicamente de
                garantizar que un animal esté libre de sufrimiento, sino también de asegurar que viva en un entorno que favorezca su desarrollo saludable, mental y social. Esto no solo incluye
                el cuidado físico, como la alimentación adecuada y la atención médica, sino también aspectos emocionales y psicológicas.
                <br />
                Las mascotas al ser animales sociales y dependientes de los humanos, requieren de atencion especial para asegurarse de que su entorno, sus interacciones y su día a día favorezcan
                su bienestar general.

              </p>
            </div>

            <div className='img2'>
              <img src={img2} alt="" className='img2-1' />
            </div>

          </div>
        </section>

        <section className='section3'>
          <div className='texto2'>
            <img src={img3} alt="" className='img3' />
            <p className='title3'>Importancia del cuidado de las mascotas domésticas</p>
            <p className='parr2'>El cuidado y bienestar de las mascotas proviene de un buen cuidado
              no solo previene de enfermedadees físicas, sino que también tiene un
              impacto directio en la salud mental y emocional del animal.
              Las mascotas especialmente los perros y gatos, son animales
              sociales que necesitan interacciones y vinculos afectivos con
              sus dueños. Esto les ayuda a mantenerse equilibrados y a evitar
              problemas de comportamiento.
            </p>
          </div>
          <div className='texto3'>
            <img src={img4} alt="" className='img4' />
            <p className='title3'>Nutrición adecuada</p>
            <p className='parr2'>
              La alimentación es uno de los pilares del bienestar de las mascotas,
              cada especie y raza tienen diferentes necesidades nutricionales, por
              lo que es importante elegir una dieta balanceada y adecuada a su edad,
              tamaño y actividad, en este punto el ejercicio no solo mantiene en
              forma a la mascota, sino que también promueve un bienestar emocional
              Los paseos, juegos y actividades permite a las macotas explorar su
              entorno el cual contribuye a su desarrollo y felicidad de tal manera que
              previene problemas de comportamiento derivados del aburrimiento
            </p>
          </div>

          <div className='texto4'>
            <img src={img5} alt="" className='img5' />
            <p className='title3'>Higiene y vinculo emocional con los dueños</p>
            <p className='parr2'>
              La higiene adecuada es vital, esto incluye bañar a las mascotas cuando sea
              necesario, cepillar su pelaje para evitar enredados y mantenerlo limpio y
              cuidar de sus uñas y dientes, las masctoas también necesitan un espacion
              cómodo y limpio donde descansar. Las mascotas no solo son animales de
              compañia, sino que se convierten en parte de la familia, brindarles amor y
              atencion, así como respetar sus limites, es clave para fortalecer el vínculo
              entre la masctoa y su dueño, lo cual también les proporciona una sesación
              de seguridad y confianza.
            </p>
          </div>
        </section>

        <section className='section4'>
          <img src={img13} alt="" className='img13' />
          <div className='texto5'>
            <h2>Vacunación:</h2>
            <p className='inf3'>Las vacunas son fundamentales para proteger su salud y prevenir enfermedades graves, una de las
              más importantes es la vacuna contra el parvovirus, que combate una enfermedad viral severa y deshidratación
              y puede ser fatal si no se trata a tiempo. Otra vacuna esencial es la del moquillo canino, una enfermedad
              viral que ataca los sistemas respiratorio. La vacuna contra la rabia es también crucial, no solo porque protege
              al perro, sino porque es una enfermedad zoonótica que puede transmitirse a los humanos.
            </p>
          </div>
        </section>

        <section className='section5'>

          <div className='texto6'>
            <p className='inf4'>
              La alimentación de las mascotas es un pilar fundamental para
              su bienestar y longevidad. Los alimentos que consumen deben
              satisfacer sus necesidades nutricionales especificas según su 
              especie, raza, tamaño, edad y nivel de actividad, a continuación
              se proporciona información detallada sobre los nutrientes
              esenciales y su importancia en la dieta de perros y gatos.
            </p>
          </div>
          <img src={img14} alt="" className='img14' />
        </section>

        <section className='section5'>
          <div className='texto6'>
            <p className='inf4'>
              <h2>Proteinas:</h2>
              Las proteinas son esenciales para la construcción y reparación de tejidos, así como para la producción de enzimas y hormonas. En perros y gatos
              las proteinas deben provenir de fuentes animales como carne, pescado, huevo y aves. Los gatos, en particular, son carnívoros estrictos y requieren
              niveles más altos de proteínas que los perros.
            </p>
            <br />
            <br />
            <p className='inf4'>
              <h2>Carbohidratos:</h2>
              Aunque no son tan indispensables, los carbohidratos son una fuente importante de enrgía rápida para perros. Los alimentos comerciales para mascotas
              suelen incluir arroz, maíz, avena o papa como fuente de carbohidratos. Sin embargo, los gatos tienen menor capacidad para metabolizarlos, por lo 
              que su dieta debe enfocarse más en proteínas y grasas.
            </p>
            <br /><br />
            <p className='inf4'>
              <h2>Grasas:</h2>
              Las grasas son una fuente de enrgía y adyudan en la absorción de vitaminas liposolubles (A, D, E Y k). Además contienen ácidos grasoso esenciales como
              el Omega-3 y Omega-6, que son importantes para la salud de la piel, el pelaje y el sistema inmunológico. Las fuentes comunes aceites de pescado y grasa
              animal.
            </p>
            <br /><br />

            <p className='inf4'>
              <h2>Vitaminas y minerales:</h2>
              Las mascotas necesitan un equilibrio de vitaminas, como la vitamina A para la visión y el sistema inmunológico y la vitamina D para la salúd ósea, otras
              mascotas como los gatos requieren especificamente de vitamina A preformada, que solo se encuentra en fuentes animales.
              <br /><br />
              Minerales como el calcio y el fósforo son cruciales para el desarrollo óseo, mientras que el zinc y el selenio apoyan la piel y el sistema inmunológico.
            </p>
            <br /><br />

            <p className='inf4'>
              <h2>Fibra:</h2>
              Un componente que ayuda a la digestión y regula el tránsito intestinal. Es especialmente útil para prevenir problemas como el estreñimiento o las bolas de
              pelo en los gatos. Las fuentes de fibra incluyen la remolacha, el salvado de trigo y la pulpa de manzana.
            </p>
            <br /><br />

            <p className='inf4'>
              <h2>Agua:</h2>
              Este es el nutriente más esencial, las mascotas deben tener acceso constante a agua fresca y limpia, ya que incluso una deshidratación leve puede afectar su 
              salud, los gatos en particular tienden a beber menos agua, por lo que es importante proporcionarles alimentos húmedos si es necesario.
            </p>
            <div className='img15-1'>
            <img src={img15} alt="" className='img15' />
            </div>

          </div>
        </section>

        <footer className='footer'>

          <div>
            <p className='parr3'>Contactos:</p>
            <img src={img9} alt="robot" className='img9' />
            <div className='contact'>
              <img src={img10} alt="" className='img10' />
              <spam>09837991163</spam>

              <img src={img11} alt="" className='img11' />
              <spam>je20042316@gmail.com</spam>

              <img src={img12} alt="" className='img12' />
              <spam>Av-lorem</spam>
            </div>
          </div>

          <div className='enlaces'>
            <p className='parr3'>Enlaces:</p>
            <ul className='dat'>
              <li className='d1'>Conocenos</li>
              <li className='d1'>Planes alimenticios</li>
              <li className='d1'>Contactos</li>
            </ul>
          </div>

          <div className='paginas'>
            <p className='parr3'>Visitanos en:</p><br />
            <img src={img6} alt="github" className='img6' />
            <img src={img8} alt="facebook" className='img8' />
            <img src={img7} alt="twitter" className='img7' />
          </div>

          <div className='comments'>
            <p className='parr3'>Suscribete:</p>
            <input type="text" /><br />
            <input type="email" /><br />
            <button>Submit</button>
          </div>
        </footer>
      </main>
    </div>
  )
}
