const express = require('express');
const pool = require('../config/db'); // Importar configuración del pool de MySQL
const router = express.Router();

// Ruta GET '/'
router.get('/', async (req, res) => {
  let connection;
  const limit = 15; // Límite de registros por página
  const page = parseInt(req.query.page) || 1; // Página actual, por defecto la primera
  const offset = (page - 1) * limit; // Offset para la consulta SQL
  const fecha = req.query.fecha || ''; // Fecha opcional para filtrar los registros

  let whereClause = ''; // Clausula WHERE para filtrar por fecha si se proporciona
  let params = []; // Parámetros para la consulta SQL

  if (fecha) {
    whereClause += 'WHERE DATE(r.fecha_hora) = ? '; // Filtrar por fecha si está definida
    params.push(fecha);
  }

  params.push(offset, limit); // Añadir offset y limit a los parámetros de la consulta

  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    // Consulta SQL para obtener registros con joins y filtrado opcional por fecha
    const [rows] = await connection.execute(
      `SELECT r.id, u.nombre, r.DNI, c.nombre_cargo, r.fecha_hora
       FROM Registros r
       JOIN Usuarios u ON r.DNI = u.DNI
       JOIN Cargos c ON u.cargo_id = c.id
       ${whereClause}
       ORDER BY r.id ASC
       LIMIT ?, ?`, // Ordenar por ID de registro y limitar resultados según página y límite
      params
    );

    // Consulta SQL para obtener el total de registros con el mismo filtrado opcional por fecha
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as count
       FROM Registros r
       ${whereClause}`,
      params.slice(0, -2) // Excluir offset y limit de los parámetros para contar
    );

    const totalRecords = countResult[0].count; // Total de registros encontrados
    const totalPages = Math.ceil(totalRecords / limit); // Calcular total de páginas

    // Renderizar la vista 'registros' y pasar datos de registros, paginación y filtro de fecha
    res.render('registros', { rows, page, totalPages, fecha });
  } catch (err) {
    console.error('Error al obtener los registros:', err.message);
    res.status(500).send('Error al obtener los registros');
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});


// Ruta para obtener todos los registros (endpoint JSON)
router.get('/api/records', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Obtener conexión del pool
    const [records] = await connection.execute('SELECT * FROM Registros');
    res.json(records); // Devolver registros como JSON
  } catch (err) {
    console.error('Error al obtener registros:', err.message);
    res.status(500).json({ error: 'Error al obtener registros' });
  } finally {
    if (connection) {
      connection.release(); // Liberar conexión del pool al finalizar
    }
  }
});

module.exports = router; // Exportar el router con las rutas definidas
