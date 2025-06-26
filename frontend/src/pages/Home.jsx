import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {

  const {userData} = useContext(AuthContext)

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Hola <span className="title-highlight">{userData ? `${userData.username}` : 'Usuario'}</span> <br /> <br />
            Transforma tu cultivo de maíz con inteligencia artificial
          </h1>
          <p className="hero-subtitle">
            Predicciones precisas, análisis inteligente y recomendaciones personalizadas para maximizar tu producción
          </p>
          <div className="hero-actions">
            <Link to="/prediccion" className="cta-button primary">
              Comenzar predicción
            </Link>
            <Link to="/historial" className="cta-button secondary">
              Ver historial
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="corn-animation">🌽</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">
          Nuestras <span className="highlight">Características</span>
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Detección Inteligente</h3>
            <p>Analiza imágenes de hojas de maíz y detecta enfermedades como roya, tizón o manchas con tecnología de aprendizaje profundo.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Recomendaciones Agrícolas</h3>
            <p>Recibe sugerencias personalizadas sobre tratamientos y cuidados según la enfermedad detectada en el cultivo.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🗂️</div>
            <h3>Historial de Diagnósticos</h3>
            <p>Accede a un registro detallado de todas tus predicciones, con fecha, clase detectada, nivel de confianza e imagen analizada.</p>
          </div>
        </div>
      </section>


      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">¿Cómo <span className="highlight">funciona</span>?</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Sube fotos de la hoja de maiz</h3>
              <p>Selecciona una imagen de tu cultivo</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Procesamos la información</h3>
              <p>Nuestros modelo entrenado para detectar enfermedades esta listo para usarse.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Obten una deteccion</h3>
              <p>El modelo detectara si tu cultivo tiene enfermedades y te brinda recomendaciones accionables para mejorar la salud de tu maiz.</p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="cta-section">
        <h2>¿Listo para optimizar tu producción de maíz?</h2>
        <p>Únete a cientos de agricultores que ya están tomando mejores decisiones con MaízVision</p>
        <Link to="/prediccion" className="cta-button primary large">
          Comenzar ahora
        </Link>
      </section>
    </div>
  );
}

export default Home;