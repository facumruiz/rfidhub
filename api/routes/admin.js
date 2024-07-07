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

// Ruta para agregar un usuario
router.post('/admin/users', async (req, res) => {
  const { dni, nombre } = req.body;
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    // Insertar un nuevo usuario en la tabla Usuarios
    await connection.execute('INSERT INTO Usuarios (DNI, nombre) VALUES (?, ?)', [dni, nombre]);
    res.redirect('/admin'); // Redirigir a la página de administración después de agregar
  } catch (err) {
    console.error('Error al agregar el usuario:', err.message);
    res.status(500).send('Error al agregar el usuario');
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para agregar una autenticación
router.post('/admin/auth', async (req, res) => {
  const { uid_rfid, auth_dni } = req.body;
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    // Insertar una nueva autenticación en la tabla Autenticacion
    await connection.execute('INSERT INTO Autenticacion (uid_rfid, DNI) VALUES (?, ?)', [uid_rfid, auth_dni]);
    res.redirect('/admin'); // Redirigir a la página de administración después de agregar
  } catch (err) {
    console.error('Error al agregar la autenticación:', err.message);
    res.status(500).send('Error al agregar la autenticación');
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

// Ruta para eliminar la autenticación de un usuario
router.delete('/admin/auth/:uid_rfid', async (req, res) => {
  const { uid_rfid } = req.params;
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    // Eliminar la autenticación de la tabla Autenticacion según el UID RFID
    await connection.execute('DELETE FROM Autenticacion WHERE uid_rfid = ?', [uid_rfid]);
    res.redirect('/admin'); // Redirigir a la página de administración después de eliminar
  } catch (err) {
    console.error('Error al eliminar la autenticación:', err.message);
    res.status(500).send('Error al eliminar la autenticación');
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

module.exports = router;
