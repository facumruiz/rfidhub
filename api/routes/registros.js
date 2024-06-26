const express = require('express');
const getConnection = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  let connection;
  const limit = 15; // Número de registros por página
  const page = parseInt(req.query.page) || 1; // Número de página actual, por defecto 1
  const offset = (page - 1) * limit; // Cálculo del offset
  const fecha = req.query.fecha || '';

  let whereClause = '';
  let params = [];

  if (fecha) {
    whereClause += 'WHERE DATE(fecha_hora) = ? ';
    params.push(fecha);
  }

  params.push(offset, limit);

  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM Registros ${whereClause}LIMIT ?, ?`, params);
    const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM Registros ${whereClause}`, params.slice(0, -2));
    const totalRecords = countResult[0].count;
    const totalPages = Math.ceil(totalRecords / limit);

    res.render('registros', { rows, page, totalPages, fecha });
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

