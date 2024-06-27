require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const methodOverride = require('method-override');
const { client, topic } = require('./config/mqtt');
const { autenticarUsuario } = require('./controllers/userController');
const registrosRouter = require('./routes/registros');
const adminRouter = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar solicitudes POST y PUT
app.use(express.urlencoded({ extended: true }));

// Middleware para permitir métodos HTTP PUT y DELETE
app.use(methodOverride('_method'));

// Rutas para la aplicación
app.use(registrosRouter); // Rutas para los registros
app.use(adminRouter); // Rutas para la administración de usuarios y autenticaciones

// Configuración de Socket.IO para eventos en tiempo real
let lastMessageTime = 0; // Variable para almacenar el tiempo del último mensaje procesado
const messageDelay = 5000; // Retardo en milisegundos (por ejemplo, 5000 ms = 5 segundos)

// Conexión al broker MQTT y suscripción al tópico
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

// Manejo de mensajes MQTT entrantes
client.on('message', (topic, message) => {
  const currentTime = Date.now();
  
  // Verificar si ha pasado el tiempo suficiente desde el último mensaje procesado
  if (currentTime - lastMessageTime >= messageDelay) {
    lastMessageTime = currentTime; // Actualizar el tiempo del último mensaje procesado

    const mensaje = message.toString();
    const uid_rfid = extraerUidRfid(mensaje);
    console.log(uid_rfid);
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

// Manejo de errores en la conexión MQTT
client.on('error', (err) => {
  console.error('Error de conexión MQTT:', err);
});

// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Función para extraer el UID RFID del mensaje MQTT
function extraerUidRfid(mensaje) {
  const regex = /\[sn: (\d+)\]/;
  const match = mensaje.match(regex);
  return match ? match[1] : null;
}
