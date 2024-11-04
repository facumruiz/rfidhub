// Importar la librería mqtt
import mqtt from 'mqtt';

// Configuración del broker y del tópico
const MQTT_BROKER_URL = 'mqtt://broker.hivemq.com';
const MQTT_TOPIC = 'grupob_request';

// Crear un cliente MQTT
const client = mqtt.connect(MQTT_BROKER_URL);

// Función para enviar un mensaje
function sendMessage(message) {
    // Publicar el mensaje en el tópico
    client.publish(MQTT_TOPIC, message, (err) => {
        if (err) {
            console.error('Error al publicar el mensaje:', err);
        } else {
            console.log(`Mensaje enviado: ${message}`);
        }
    });
}

// Evento que se ejecuta al conectar
client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    
    // Aquí puedes enviar el mensaje que desees
    const messageToSend = 'A1B2C3D4E';
    sendMessage(messageToSend);

    // Cerrar la conexión después de enviar el mensaje
    client.end();
});

// Manejar errores
client.on('error', (err) => {
    console.error('Error de conexión:', err);
});
