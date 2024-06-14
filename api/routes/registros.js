const express = require('express');
const getConnection = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM Registros');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Registros</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="/socket.io/socket.io.js"></script>
        <script>
          const socket = io();
          socket.on('actualizarTabla', () => {
            location.reload();
          });
        </script>
      </head>
      <body>
        <div class="container mt-5">
          <h1 class="mb-4">Registros</h1>
          <table class="table table-bordered">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.DNI}</td>
                  <td>${row.fecha_hora}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `);
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
