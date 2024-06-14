require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { client, topic } = require('./config/mqtt');
const { autenticarUsuario } = require('./controllers/userController');
const registrosRouter = require('./routes/registros');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(registrosRouter);

let lastMessageTime = 0; // Variable para almacenar el tiempo del último mensaje procesado
const messageDelay = 5000; // Retardo en milisegundos (por ejemplo, 5000 ms = 5 segundos)

client.on('connect', () => {
  console.log('Conectado al broker MQTT');
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Error al suscribirse al tópico:', err);
    } else {
      console.log(`Suscrito al tópico: ${topic}`);
    }
  });
});

client.on('message', (topic, message) => {
  const currentTime = Date.now();
  
  // Verificar si ha pasado el tiempo suficiente desde el último mensaje procesado
  if (currentTime - lastMessageTime >= messageDelay) {
    lastMessageTime = currentTime; // Actualizar el tiempo del último mensaje procesado

    const mensaje = message.toString();
    const uid_rfid = extraerUidRfid(mensaje);
    console.log(uid_rfid)
    if (uid_rfid) {
      console.log(`Mensaje recibido en ${topic}: ${uid_rfid}`);
      autenticarUsuario(uid_rfid, io);
    } else {
      console.log('No se encontró un número de uid_rfid válido en el mensaje:', mensaje);
    }
  } else {
    console.log('Mensaje recibido demasiado pronto, ignorado:', message.toString());
  }
});

client.on('error', (err) => {
  console.error('Error de conexión:', err);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

function extraerUidRfid(mensaje) {
  const regex = /\[sn: (\d+)\]/;
  const match = mensaje.match(regex);
  return match ? match[1] : null;
}
