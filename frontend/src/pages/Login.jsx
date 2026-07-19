import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../Styles/Pages/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
  });

//esta madre no muestra si escribes lol
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.usuario || !formData.password) {
      setError('Por favor completa usuario y contraseña.');
      return;
    }

    setCargando(true);

    try {
      // Aquí se llamará a authService.js
      // Ejemplo: const response = await authService.login(formData.usuario, formData.password);
      // Guardar token, redirigir según rol (Encargado / cajero), etc.

       // Redirige según el rol devuelto por el backend; de momento va al dashboard del encargado pq se ve más pro
+       navigate('/dashboard');
    } catch (err) {
      
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setCargando(false);
    }
  };
// HTMLLLLL 
  return (
    <div className="login-container">
      <div className="login-brand">
        <h1 className="login-brand-title">ADM bodega</h1>
        <h2 className="login-brand-subtitle">Sistema de Inventario</h2>
      </div>

      <div className="login-card">
        <h3 className="login-card-title">Login</h3>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label htmlFor="usuario" className="login-label">
              Usuario:
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="login-input"
              value={formData.usuario}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Contraseña:
            </label>
            <div className="login-password-wrapper">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className="login-input"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setMostrarPassword((prev) => !prev)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? (
                  // Ícono "ojo abierto"
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  // Ícono "ojo cerrado" pq ojos q no ven, corazón q no siente
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.6 18.6 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
