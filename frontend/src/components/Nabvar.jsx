import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Nabvar.css';

function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <span className="logo-icon">🌽</span>
            <span className="logo-text">MaízVision</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <span className="link-icon">🏠</span>
            <span>Home</span>
          </Link>

          {token ? (
            <>
              <Link to="/prediccion" className="nav-link">
                <span className="link-icon">🔮</span>
                <span>Predicción</span>
              </Link>
              <Link to="/historial" className="nav-link">
                <span className="link-icon">📊</span>
                <span>Historial</span>
              </Link>
              <button onClick={cerrarSesion} className="logout-btn">
                <span className="btn-icon">🚪</span>
                <span>Cerrar sesión</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <span className="link-icon">🔑</span>
                <span>Iniciar sesión</span>
              </Link>
              <Link to="/registro" className="nav-link">
                <span className="link-icon">📝</span>
                <span>Registrarse</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
