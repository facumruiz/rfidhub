const pool = require('../config/db');
const { client, resultTopic } = require('../config/mqtt');

async function autenticarUsuario(mensaje, io) {
  // Extraer UID RFID usando expresión regular
  const regex = /\[sn:\s*(\d+)\]/;
  const match = mensaje.match(regex);
  
  if (!match) {
    console.error('No se encontró un número de UID RFID válido en el mensaje:', mensaje);
    return;
  }
  
  const uid_rfid = match[1];
  //console.log("UID RFID encontrado:", uid_rfid);

  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute('CALL AutenticarUsuario(?, @resultado)', [uid_rfid]);
    const [resultQuery] = await connection.execute('SELECT @resultado AS resultado');
    const resultado = resultQuery[0].resultado;

    io.emit('actualizarTabla', resultado);
    // Enviar el UID RFID a través de Socket.IO al cliente
    io.emit('uid_rfid', uid_rfid);

    // Publicar el resultado en el nuevo tópico MQTT
    client.publish(resultTopic, resultado.toString(), { qos: 1 }, (err) => {
      if (err) {
        console.error('Error al publicar en el tópico MQTT:', err);
      } else {
        console.log(`Resultado publicado en el tópico ${resultTopic}: ${resultado}`);
      }
    });
  } catch (err) {
    console.error('Error al autenticar usuario:', err.message);
  } finally {
    if (connection) {
      connection.release(); // Liberar la conexión del pool
    }
  }
}

module.exports = {
  autenticarUsuario
};
