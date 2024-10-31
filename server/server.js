import express from 'express';
import cors from 'cors';
import connectDB from './services/dbService.js';

import recordRoutes from './routes/recordRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import accessRoutes from './routes/recordRoutes.js';
import mqttRoutes from './routes/mqttRoutes.js'

import AccessRecord from './models/recordModel.js';

import errorMiddleware from './middleware/errorMiddleware.js';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swaggerConfig.js';

import { PORT, FRONT_URL, MQTT_URL, MQTT_TOPIC, MQTT_RESULT_TOPIC } from './config/env.js';
import jwt from 'jsonwebtoken';
import mqtt from 'mqtt';
import { verifyUid } from './controllers/authController.js';

const app = express();

// Configuración de la clave secreta para JWT
app.set("secretKey", "1863");

// Configuración de CORS
app.use(cors({
  origin: FRONT_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-access-token'],
}));

// Middleware para JSON
app.use(express.json());

// Documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas de la API
app.use('/record', recordRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/access', accessRoutes);
app.use('/mqtt', mqttRoutes);

// Middleware para manejo de errores
app.use(errorMiddleware);

// Configuración del cliente MQTT
const mqttClient = mqtt.connect(MQTT_URL);

mqttClient.on('connect', () => {
  console.log('Conectado al broker MQTT');
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('Error al suscribirse al tópico:', err);
    } else {
      console.log(`Suscrito al tópico: ${MQTT_TOPIC}`);

      // Conectar a MongoDB después de conectar MQTT
      connectDB()
        .then(() => {
          console.log('Conectado a MongoDB');
          app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
          });
        })
        .catch(error => console.error('Error al conectar a MongoDB:', error));
    }
  });
});

mqttClient.on('error', (error) => {
  console.error('Error en la conexión MQTT:', error);
});

// Manejo del mensaje recibido en MQTT
mqttClient.on('message', async (topic, message) => {
  console.log(`Mensaje recibido en el tópico ${topic}: ${message.toString()}`);
  
  try {
    const uid = message.toString();
    const authResult = await verifyUid(uid);

    if (authResult === 1) {
      console.log('Autenticación exitosa.');

      // Publicar el número 1 en el tópico de resultado
      mqttClient.publish(MQTT_RESULT_TOPIC, '1', (err) => {
        if (err) {
          console.error('Error al publicar en el tópico de resultado:', err);
        } else {
          console.log(`Mensaje enviado al tópico ${MQTT_RESULT_TOPIC}: 1`);
        }
      });

      // Guardar el registro de acceso en la base de datos
      const accessRecord = new AccessRecord({
        uid: uid,
        timestamp: new Date(),  // Guarda la fecha y hora actuales
        result: 'success'
      });

      await accessRecord.save();
      console.log('Registro de acceso guardado en la base de datos.');

    } else {
      console.log('Autenticación fallida.');
      // Lógica si la autenticación falló
    }
  } catch (error) {
    console.error('Error en el procesamiento de autenticación:', error);
  }
});


// Función para verificar el token JWT
function verifyToken(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (err, payload) {
    if (err) {
      res.json({ message: err.message });
    } else {
      req.body.userId = payload.userId;
      next();
    }
  });
}

// Exportar la aplicación y la función verifyToken
app.verifyToken = verifyToken;

export default app;
