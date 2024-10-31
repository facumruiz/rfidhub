import React, { useState } from 'react';
import { userApi } from '../../api';
import { jwtDecode } from 'jwt-decode'; // Importación con llaves
import { useNavigate, Link } from 'react-router-dom'; // Combina las importaciones de useNavigate y Link

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await userApi.login(email, password);
      const token = response.data.token;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.role === 'admin';

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error de autenticación, por favor intenta de nuevo.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <p className="mt-3">
        ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
      </p>
      <p>
        ¿Olvidaste tu contraseña? <Link to="/request-password-reset">Recupérala aquí</Link> {/* Enlace a la página de recuperación de contraseña */}
      </p>
    </div>
  );
};

export default Login;

