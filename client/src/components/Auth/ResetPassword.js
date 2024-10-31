import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); // Obtiene el token desde la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5050/user/reset-password/${token}`, { newPassword });
      setSuccess(response.data.message);

      // Redirecciona a la página de login después de unos segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al restablecer la contraseña. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Restablecer Contraseña</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar Nueva Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <button type="submit" className="btn btn-primary">Restablecer Contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;
