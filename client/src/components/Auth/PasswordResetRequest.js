import React, { useState } from 'react';
import { userApi } from '../../api'; // Asegúrate de crear esta función en tu API
import { Link } from 'react-router-dom';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await userApi.requestPasswordReset({ email });
      setMessage('Si el correo está registrado, te enviaremos instrucciones para recuperar tu contraseña.');
    } catch (error) {
      setError('Error al solicitar la recuperación de contraseña, intenta nuevamente.');
    }
  };

  return (
    <div className="container">
      <h2>Recuperar Contraseña</h2>
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
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <p className="mt-3">
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </div>
  );
};

export default PasswordResetRequest;
