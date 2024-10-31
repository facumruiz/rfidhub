import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5050;
export const DB_URI = process.env.ATLAS_URI || '';
export const FRONT_URL = process.env.BASE_URL || '';
export const MQTT_TOPIC = process.env.MQTT_TOPIC;
export const MQTT_RESULT_TOPIC = process.env.MQTT_RESULT_TOPIC;
export const MQTT_URL = process.env.MQTT_BROKER_URL;

