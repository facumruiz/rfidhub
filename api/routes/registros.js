const express = require('express');
const getConnection = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Registros');
    res.render('registros', { rows });
  } catch (err) {
    console.error('Error al obtener los registros:', err.message);
    res.status(500).send('Error al obtener los registros');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;

