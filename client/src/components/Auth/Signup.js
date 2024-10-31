// src/components/Signup.js
import React, { useState } from 'react';
import { userApi } from '../../api';
import { useNavigate } from 'react-router-dom'; // Cambiado a useNavigate
import { Link } from 'react-router-dom'; // Importar Link para navegación

const Signup = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await userApi.signup(username, email, password);
      console.log('Registro exitoso', response.data);
      // Redirigir al usuario a otra página o mostrar un mensaje de éxito
      navigate('/');
    } catch (error) {
      setError('Error al crear el usuario: ' + (error.response?.data?.message || error.message));
      console.error('Error al crear el usuario', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
     
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registrando...' : 'Signup'}
        </button>
             
      <p className="mt-3">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesion aquí</Link> {/* Enlace a la página de registro */}
      </p>
      </form>
    </div>
  );
};

export default Signup;
