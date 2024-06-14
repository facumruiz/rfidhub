const getConnection = require('../config/db');
const { client, resultTopic } = require('../config/mqtt');

async function autenticarUsuario(uid_rfid, io) {
  console.log(uid_rfid);
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.execute('CALL AutenticarUsuario(?, @resultado)', [uid_rfid]);
    const [resultQuery] = await connection.execute('SELECT @resultado AS resultado');
    const resultado = resultQuery[0].resultado;
    console.log('Procedimiento ejecutado con éxito:', resultado);

    io.emit('actualizarTabla', resultado);

    // Publicar el resultado en el nuevo tópico MQTT
    client.publish(resultTopic, JSON.stringify({ uid_rfid, resultado }), { qos: 1 }, (err) => {
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
      await connection.end();
    }
  }
}

module.exports = {
  autenticarUsuario
};
