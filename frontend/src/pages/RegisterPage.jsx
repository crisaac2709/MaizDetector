import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.css';

function RegisterPage() {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    return requirements;
  };

  const validate = () => {
    const newErrors = {};
    const passwordReq = validatePassword(form.password);

    if (!form.username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    } else if (form.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }

    if (!form.email.includes('@') || !form.email.includes('.')) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!passwordReq.minLength) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else {
      let missing = [];
      if (!passwordReq.hasUpper) missing.push('una mayúscula');
      if (!passwordReq.hasLower) missing.push('una minúscula');
      if (!passwordReq.hasNumber) missing.push('un número');
      if (!passwordReq.hasSpecial) missing.push('un carácter especial');
      
      if (missing.length > 0) {
        newErrors.password = `Falta ${missing.join(', ')}`;
      }
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar error específico al escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/usuarios/registro/', {
        username: form.username,
        email: form.email,
        password: form.password
      });
      
      setSuccessMessage(res.data.mensaje || '¡Registro exitoso! Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data) {
        // Manejar errores específicos del backend
        const backendErrors = {};
        if (err.response.data.username) {
          backendErrors.username = err.response.data.username[0];
        }
        if (err.response.data.email) {
          backendErrors.email = err.response.data.email[0];
        }
        if (err.response.data.password) {
          backendErrors.password = err.response.data.password[0];
        }
        setErrors(backendErrors);
      } else {
        setErrors({ general: 'Error al conectar con el servidor' });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = validatePassword(form.password);

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <span className="logo-icon">🌽</span>
            <span className="logo-text">MaízVision</span>
          </div>
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Completa el formulario para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              <span className="success-icon">✓</span>
              {successMessage}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ej: agricultor123"
              value={form.username}
              onChange={handleChange}
              className={`register-input ${errors.username ? 'input-error' : ''}`}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ej: usuario@example.com"
              value={form.email}
              onChange={handleChange}
              className={`register-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Crea una contraseña segura"
              value={form.password}
              onChange={handleChange}
              className={`register-input ${errors.password ? 'input-error' : ''}`}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            
            <div className="password-strength">
              <div className={`strength-item ${passwordRequirements.minLength ? 'valid' : ''}`}>
                <span className="strength-icon">
                  {passwordRequirements.minLength ? '✓' : '•'}
                </span>
                <span>Mínimo 8 caracteres</span>
              </div>
              <div className={`strength-item ${passwordRequirements.hasUpper ? 'valid' : ''}`}>
                <span className="strength-icon">
                  {passwordRequirements.hasUpper ? '✓' : '•'}
                </span>
                <span>1 mayúscula</span>
              </div>
              <div className={`strength-item ${passwordRequirements.hasLower ? 'valid' : ''}`}>
                <span className="strength-icon">
                  {passwordRequirements.hasLower ? '✓' : '•'}
                </span>
                <span>1 minúscula</span>
              </div>
              <div className={`strength-item ${passwordRequirements.hasNumber ? 'valid' : ''}`}>
                <span className="strength-icon">
                  {passwordRequirements.hasNumber ? '✓' : '•'}
                </span>
                <span>1 número</span>
              </div>
              <div className={`strength-item ${passwordRequirements.hasSpecial ? 'valid' : ''}`}>
                <span className="strength-icon">
                  {passwordRequirements.hasSpecial ? '✓' : '•'}
                </span>
                <span>1 carácter especial</span>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`register-input ${errors.confirmPassword ? 'input-error' : ''}`}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Registrarse'
            )}
          </button>

          <div className="register-footer">
            <p className="login-text">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="login-link">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;