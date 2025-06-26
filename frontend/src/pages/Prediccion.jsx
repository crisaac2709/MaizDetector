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
                  <span className="result-label">Nombre en español:</span>
                  <span className="result-value">{getNombreEnfermedad(resultado.clase)}</span>
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
                    {getRecomendacion(resultado.clase)}
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


function getRecomendacion(condicion) {
  const recomendaciones = {
    "Healthy": "🌱 Tu cultivo parece estar en buenas condiciones. Mantén las prácticas actuales, como un buen manejo del riego, fertilización equilibrada y control de plagas preventivo. Asegúrate de monitorear regularmente el estado de las plantas para mantenerlas saludables.",
    
    "Common_Rust": "🌾 Roya Común: Aplica fungicidas específicos contra la roya común, preferentemente en las primeras etapas de la enfermedad. Realiza rotación de cultivos para reducir la persistencia de la enfermedad en el suelo y asegúrate de controlar la humedad excesiva en las plantas para evitar su propagación.",
    
    "Blight": "🛡️ Tizón: Elimina inmediatamente las hojas infectadas para prevenir la propagación de la enfermedad. Utiliza tratamientos preventivos con fungicidas de amplio espectro y asegúrate de mantener una buena circulación de aire entre las plantas. Evita el riego por aspersión, ya que puede favorecer la propagación del hongo.",
    
    "Gray_Leaf_Spot": "🍂 Manchas Foliares: Evita riegos por aspersión, ya que la humedad en las hojas puede favorecer la aparición de manchas foliares. Aplica fungicidas adecuados contra el hongo y asegúrate de mantener un buen control del espacio entre las plantas para mejorar la ventilación. Realiza una buena práctica de limpieza de residuos de cultivo al final de la temporada.",
    
    "default": "📋 Consulta con un especialista agrícola para un diagnóstico más preciso. Es importante hacer un análisis adecuado del terreno y las condiciones de cultivo antes de aplicar cualquier tratamiento o recomendación. Un diagnóstico adecuado ayudará a elegir el tratamiento más efectivo."
  };
  
  return recomendaciones[condicion] || recomendaciones["default"];
}


function getNombreEnfermedad(condicion) {
  const nombres = {
    "Healthy": "🌱 Hoja Sana",
    "Common_Rust": "🌾 Roya Común",
    "Blight": "🛡️ Tizón",
    "Gray_Leaf_Spot": "🍂 Manchas Foliares",
    "default": "❓ No Reconocido"
  };
  
  return nombres[condicion] || nombres["No default"]
};

export default Prediccion;