
require('dotenv').config();
const mqtt = require('mqtt');

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = process.env.MQTT_TOPIC;
const resultTopic = process.env.MQTT_RESULT_TOPIC;

if (!brokerUrl || !topic || !resultTopic) {
  console.error('Por favor, configure las variables de entorno MQTT_BROKER_URL, MQTT_TOPIC y MQTT_RESULT_TOPIC');
  process.exit(1);
}

const client = mqtt.connect(brokerUrl);

module.exports = {
  client,
  topic,
  resultTopic
};
