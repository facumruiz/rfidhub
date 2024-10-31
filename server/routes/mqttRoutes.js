// routes/mqttRoutes.js
import express from 'express';
import mqtt from 'mqtt';


const router = express.Router();

// Configuración del broker y del tópico
const MQTT_BROKER_URL = 'mqtt://broker.hivemq.com';
const MQTT_TOPIC = 'grupob_request';

// Crear un cliente MQTT
const client = mqtt.connect(MQTT_BROKER_URL);

// Evento que se ejecuta al conectar
client.on('connect', () => {
    console.log('Conectado al broker MQTT');
});

// Manejar errores
client.on('error', (err) => {
    console.error('Error de conexión:', err);
});

// Ruta para enviar un mensaje a través de MQTT
router.post('/send-message', (req, res) => {
    const { message } = req.body; // Espera que el cuerpo de la solicitud tenga el mensaje

    if (!message) {
        return res.status(400).json({ error: 'Se requiere un mensaje para enviar.' });
    }

    // Publicar el mensaje en el tópico
    client.publish(MQTT_TOPIC, message, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje:', err);
            return res.status(500).json({ error: 'Error al publicar el mensaje.' });
        } else {
            console.log(`Mensaje enviado: ${message}`);
            return res.status(200).json({ success: true, message: `Mensaje enviado: ${message}` });
        }
    });
});

export default router;
