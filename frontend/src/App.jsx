import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Nabvar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Prediccion from './pages/Prediccion';
import Historial from './pages/Historial';
import Home from './pages/Home';

function App() {
  const { token } = useContext(AuthContext);

  const RutaPrivada = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const RutaPublica = ({ children }) => {
    return !token ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
              <Home />
          }
        />
        <Route
          path="/login"
          element={
            <RutaPublica>
              <LoginPage />
            </RutaPublica>
          }
        />
        <Route
          path="/registro"
          element={
            <RutaPublica>
              <RegisterPage />
            </RutaPublica>
          }
        />
        <Route
          path="/prediccion"
          element={
            <RutaPrivada>
              <Prediccion />
            </RutaPrivada>
          }
        />
        <Route
          path="/historial"
          element={
            <RutaPrivada>
              <Historial />
            </RutaPrivada>
          }
        />
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
