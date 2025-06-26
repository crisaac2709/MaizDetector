import { use, useEffect, useState } from 'react';
import axios from 'axios';
import TarjetaPrediccion from '../components/TarjetaPrediccion';
import '../styles/Historial.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Historial() {
  const [predicciones, setPredicciones] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const {userData}  = useContext(AuthContext)

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get('http://localhost:8000/api/predicciones/mias/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPredicciones(res.data);
        setError('');
      } catch (err) {
        setError('No se pudo obtener el historial. ' + 
          (err.response?.status === 401 ? 'Tu sesión ha expirado.' : 'Intenta recargar la página.'));
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta predicción?')) return;
    
    try {
      setDeletingId(id);
      const token = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/api/predicciones/eliminar/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPredicciones(predicciones.filter(pred => pred.id !== id));
    } catch (err) {
      setError('No se pudo eliminar la predicción. ' + 
        (err.response?.status === 401 ? 'Tu sesión ha expirado.' : 'Intenta nuevamente.'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2 className="history-title">
          <span className="title-icon">📋</span> Historial de Predicciones de <span className="title-highlight">{userData ? `${userData.username}` : 'Usuario'}</span>
        </h2>
        <p className="history-subtitle">
          Revisa todas las predicciones que has realizado
        </p>
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>Cargando tu historial...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Recargar
          </button>
        </div>
      ) : predicciones.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">🌽</div>
          <h3>No hay predicciones aún</h3>
          <p>Realiza tu primera predicción para ver los resultados aquí</p>
        </div>
      ) : (
        <div className="predictions-grid">
          {predicciones.map((pred) => (
            <TarjetaPrediccion
              key={pred.id}
              prediccion={pred}
              onDelete={handleDelete}
              deleting={deletingId === pred.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Historial;
