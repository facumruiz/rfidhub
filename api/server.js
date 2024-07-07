// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Importar módulos y configuraciones necesarias
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const methodOverride = require('method-override');
const { client, topic } = require('./config/mqtt'); // Importar cliente MQTT y tópico
const { autenticarUsuario } = require('./controllers/userController'); // Importar función para autenticar usuario desde el controlador
const registrosRouter = require('./routes/registros'); // Importar rutas para registros
const adminRouter = require('./routes/admin'); // Importar rutas para administración

const app = express(); // Crear una instancia de la aplicación Express
const server = http.createServer(app); // Crear servidor HTTP usando Express
const io = socketIo(server); // Configurar Socket.IO para comunicación en tiempo real

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs'); // Configurar EJS como motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Establecer la carpeta de vistas

// Middleware para manejar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar solicitudes POST y PUT
app.use(express.urlencoded({ extended: true }));

// Middleware para permitir métodos HTTP PUT y DELETE
app.use(methodOverride('_method'));

// Configurar las rutas de la aplicación
app.use(registrosRouter); // Rutas para manejar registros
app.use(adminRouter); // Rutas para administración de usuarios y autenticaciones

// Configuración de Socket.IO para eventos en tiempo real
let lastMessageTime = 0;
const messageDelay = 10000; // Retraso mínimo entre mensajes para evitar procesamiento duplicado

// Conexión al broker MQTT y suscripción al tópico
client.on('connect', () => {
  console.log('Conexión establecida con el broker MQTT');
  // Suscripción al tópico MQTT con calidad de servicio (QoS) 1
  client.subscribe(topic, { qos: 1 }, (err) => {
    if (err) {
      console.error('Error al suscribirse al tópico MQTT:', err);
    } else {
      console.log(`Suscrito al tópico MQTT: ${topic}`);
    }
  });
});

// Manejar mensajes recibidos del tópico MQTT
client.on('message', (topic, message) => {
  const now = Date.now();
  // Verificar si ha pasado suficiente tiempo desde el último mensaje para procesar uno nuevo
  if (now - lastMessageTime >= messageDelay) {
    lastMessageTime = now;
    const uid_rfid = message.toString(); // Convertir el mensaje del tópico MQTT a cadena
    autenticarUsuario(uid_rfid, io); // Llamar a la función para autenticar usuario y pasar el UID RFID y el objeto io de Socket.IO

  } else console.log ("Mensaje recibido demasiado pronto")
  
});

// Manejar eventos de Socket.IO
io.on('connection', (socket) => {
  // Eventos de conexión y desconexión de clientes Socket.IO
  // Se pueden manejar otros eventos personalizados aquí según sea necesario
});

// Configuración del puerto del servidor
const PORT = process.env.PORT || 3000; // Puerto obtenido de las variables de entorno o predeterminado 3000
server.listen(PORT, () => {
  console.log(`Servidor API en ejecución en http://localhost:${PORT}`);
});
