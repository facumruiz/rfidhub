const express = require('express');
const getConnection = require('../config/db');
const router = express.Router();

// Ruta para mostrar la página de administración
router.get('/admin', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [users] = await connection.execute('SELECT * FROM Usuarios');
    const [auths] = await connection.execute('SELECT * FROM Autenticacion');
    res.render('admin', { users, auths });
  } catch (err) {
    console.error('Error al obtener los datos:', err.message);
    res.status(500).send('Error al obtener los datos');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Ruta para agregar un usuario
router.post('/admin/users', async (req, res) => {
  const { dni, nombre, cargo_id, nacionalidad_id } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute('INSERT INTO Usuarios (DNI, nombre) VALUES (?, ?)', [dni, nombre]);
    res.redirect('/admin');
  } catch (err) {
    console.error('Error al agregar el usuario:', err.message);
    res.status(500).send('Error al agregar el usuario');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Ruta para agregar una autenticación
router.post('/admin/auth', async (req, res) => {
  const { uid_rfid, auth_dni } = req.body;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute('INSERT INTO Autenticacion (uid_rfid, DNI) VALUES (?, ?)', [uid_rfid, auth_dni]);
    res.redirect('/admin');
  } catch (err) {
    console.error('Error al agregar la autenticación:', err.message);
    res.status(500).send('Error al agregar la autenticación');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Ruta para eliminar la autenticación de un usuario
router.delete('/admin/auth/:uid_rfid', async (req, res) => {
  const { uid_rfid } = req.params;
  let connection;
  try {
    connection = await getConnection();
    await connection.execute('DELETE FROM Autenticacion WHERE uid_rfid = ?', [uid_rfid]);
    res.redirect('/admin');
  } catch (err) {
    console.error('Error al eliminar la autenticación:', err.message);
    res.status(500).send('Error al eliminar la autenticación');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;
