import { useState } from 'react';
import axios from 'axios';
import '../styles/Prediccion.css';

function Prediccion() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResultado(null);
    setError('');
    
    // Crear vista previa
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      setIsLoading(true);
      const token = localStorage.getItem('access');
      const res = await axios.post('http://localhost:8000/api/predicciones/predecir/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setResultado(res.data);
      setError('');
    } catch (err) {
      console.error("Error backend:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
      } else {
        setError(err.response?.data?.imagen?.[0] || 'Hubo un problema al procesar la imagen.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prediction-container">
      <div className="prediction-card">
        <h2 className="prediction-title">Análisis de Cultivo de Maíz</h2>
        <p className="prediction-subtitle">Sube una imagen para detectar posibles enfermedades o condiciones</p>
        
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="file-upload-container">
            <label htmlFor="file-upload" className="file-upload-label">
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📁</span>
                  <span>Selecciona una imagen</span>
                </div>
              )}
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="file-input" 
              />
            </label>
          </div>
          
          <button 
            type="submit" 
            className="predict-button"
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Analizar Imagen'
            )}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {resultado && (
          <div className="result-container">
            <h3 className="result-title">Resultados del Análisis</h3>
            <div className="result-grid">
              <div className="result-image">
                <img 
                  src={`http://localhost:8000${resultado.imagen}`} 
                  alt="Resultado del análisis" 
                  className="result-image-preview"
                />
              </div>
              <div className="result-details">
                <div className="result-item">
                  <span className="result-label">Condición detectada:</span>
                  <span className="result-value">{resultado.clase}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Nivel de confianza:</span>
                  <span className="result-value confidence">
                    {(resultado.confianza * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Recomendación:</span>
                  <span className="result-value">
                    {getRecommendation(resultado.clase)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Función auxiliar para recomendaciones basadas en la condición detectada
function getRecommendation(condition) {
  const recommendations = {
  "Healthy": "🌱 Tu cultivo parece estar en buenas condiciones. Mantén las prácticas actuales.",
  "Common_Rust": "🌾 Aplica fungicidas específicos contra roya común y realiza rotación de cultivos.",
  "Blight": "🛡️ Elimina hojas infectadas y usa tratamientos preventivos de control de tizón.",
  "Gray_Leaf_Spot": "🍂 Evita riegos por aspersión y aplica fungicidas adecuados contra manchas foliares.",
  "default": "📋 Consulta con un especialista agrícola para un diagnóstico más preciso."
};
  
  return recommendations[condition] || recommendations["default"];

}

export default Prediccion;