import PropTypes from 'prop-types';

function TarjetaPrediccion({ prediccion, onDelete, deleting }) {
  const { id, clase, confianza, fecha, imagen } = prediccion;

  const handleImageError = (e) => {
    e.target.src = '/placeholder-image.jpg';
  };

  return (
    <div className="prediction-card">
      <div className="card-image-container">
        <img
          src={imagen}
          alt="Predicción"
          className="prediction-image"
          onError={handleImageError}
        />
      </div>

      <div className="card-content">
        <div className="prediction-info">
          <div className="info-item">
            <span className="info-label">Diagnóstico:</span>
            <span className={`info-value ${clase.toLowerCase()}`}>{clase}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Confianza:</span>
            <span className="info-value confidence">{(confianza * 100).toFixed(2)}%</span>
          </div>

          <div className="info-item">
            <span className="info-label">Fecha:</span>
            <span className="info-value date">
              {new Date(fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className="card-actions">
          <button
            onClick={() => onDelete(id)}
            className="delete-button"
            disabled={deleting}
          >
            {deleting ? (
              <span className="deleting-spinner"></span>
            ) : (
              'Eliminar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

TarjetaPrediccion.propTypes = {
  prediccion: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleting: PropTypes.bool.isRequired
};

export default TarjetaPrediccion;
