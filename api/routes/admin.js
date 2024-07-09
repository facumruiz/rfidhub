const express = require('express');
const pool = require('../config/db'); // Importar configuración del pool de MySQL
const router = express.Router();

// Ruta para mostrar la página de administración
router.get('/admin', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    // Consultar todos los usuarios y autenticaciones desde la base de datos
    const [users] = await connection.execute('SELECT * FROM Usuarios');
    const [auths] = await connection.execute('SELECT * FROM Autenticacion');
    // Renderizar la vista 'admin' y pasar los datos obtenidos
    res.render('admin', { users, auths });
  } catch (err) {
    console.error('Error al obtener los datos:', err.message);
    res.status(500).send('Error al obtener los datos');
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para obtener todos los usuarios (endpoint JSON)
router.get('/api/users', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    const [users] = await connection.execute('SELECT * FROM Usuarios');
    res.json(users); // Devolver usuarios como JSON
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para agregar un usuario (endpoint JSON)
router.post('/api/users', async (req, res) => {
  const { dni, nombre } = req.body;
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    await connection.execute('INSERT INTO Usuarios (DNI, nombre) VALUES (?, ?)', [dni, nombre]);
    res.status(201).json({ message: 'Usuario agregado correctamente' });
  } catch (err) {
    console.error('Error al agregar usuario:', err.message);
    res.status(500).json({ error: 'Error al agregar usuario' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para obtener todas las autenticaciones (endpoint JSON)
router.get('/api/auth', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    const [auths] = await connection.execute('SELECT * FROM Autenticacion');
    res.json(auths); // Devolver autenticaciones como JSON
  } catch (err) {
    console.error('Error al obtener autenticaciones:', err.message);
    res.status(500).json({ error: 'Error al obtener autenticaciones' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para agregar una autenticación (endpoint JSON)
router.post('/api/auth', async (req, res) => {
  const { uid_rfid, auth_dni } = req.body;
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    await connection.execute('INSERT INTO Autenticacion (uid_rfid, DNI) VALUES (?, ?)', [uid_rfid, auth_dni]);
    res.status(201).json({ message: 'Autenticación agregada correctamente' });
  } catch (err) {
    console.error('Error al agregar autenticación:', err.message);
    res.status(500).json({ error: 'Error al agregar autenticación' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para eliminar una autenticación por UID RFID (endpoint JSON)
router.delete('/api/auth/:uid_rfid', async (req, res) => {
  const { uid_rfid } = req.params;
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    await connection.execute('DELETE FROM Autenticacion WHERE uid_rfid = ?', [uid_rfid]);
    res.json({ message: 'Autenticación eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar autenticación:', err.message);
    res.status(500).json({ error: 'Error al eliminar autenticación' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

module.exports = router;
