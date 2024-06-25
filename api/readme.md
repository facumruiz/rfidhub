# Sistema de Autenticación RFID con Express, MQTT y MySQL

Este proyecto es un sistema de autenticación RFID utilizando `Node.js`, `Express`, `MQTT` y `MySQL`. El sistema se conecta a un broker MQTT, escucha mensajes de UID RFID y autentica a los usuarios en una base de datos MySQL.

## Requisitos

- Node.js
- MySQL
- Un broker MQTT (como Mosquitto)
  
## Estructura del proyecto
    ```
    api/
    │
    ├── config/
    │   └── db.js
    │   └── mqtt.js
    │
    ├── controllers/
    │   └── userController.js
    │
    ├── routes/
    │   └── registros.js
    │
    ├── public/
    │   └── (assets like CSS, JS, images)
    │
    ├── server.js
    │
    └── .env
    ```

## Configuración

1. Instala las dependencias:

    ```bash
    npm install
    ```


2. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido, ajustando los valores según tu configuración:

    ```plaintext
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_NAME=AccesoRFID

    MQTT_BROKER_URL=mqtt://tu_broker_url
    MQTT_TOPIC=tu_tema
    PORT=3000
    ```


## Ejecución

3. Inicia el servidor:

    ```bash
    node server.js
    ```

4. El servidor se ejecutará en `http://localhost:3000`.

## Descripción del Código

- `require('dotenv').config();`: Carga las variables de entorno del archivo `.env`.
- `const express = require('express');`: Importa el framework Express.
- `const mqtt = require('mqtt');`: Importa la biblioteca MQTT para Node.js.
- `const mysql = require('mysql2/promise');`: Importa el cliente MySQL para Node.js con soporte para promesas.
- `const path = require('path');`: Importa el módulo `path` para trabajar con rutas de archivos.
- `const http = require('http');`: Importa el módulo HTTP para crear el servidor.
- `const socketIo = require('socket.io');`: Importa `Socket.io` para la comunicación en tiempo real.

### Configuración de la base de datos y MQTT

- Configura los detalles de conexión a la base de datos y al broker MQTT utilizando las variables de entorno.

### Funciones

- `extraerUidRfid(mensaje)`: Extrae el UID RFID de un mensaje recibido.
- `autenticarUsuario(uid_rfid, io)`: Autentica el usuario en la base de datos utilizando el UID RFID y emite un evento para actualizar la interfaz en tiempo real.

### MQTT

- Maneja la conexión al broker MQTT, la suscripción al tópico especificado y la recepción de mensajes.
- Cuando se recibe un mensaje, se extrae el UID RFID y se llama a `autenticarUsuario`.

### Express y Socket.io

- Configura un servidor HTTP utilizando Express y Socket.io.
- Sirve archivos estáticos desde la carpeta `views`.
- Define una ruta `/` para mostrar los registros almacenados en la base de datos.

### Iniciar el Servidor

- El servidor se inicia y escucha en el puerto especificado en las variables de entorno o en el puerto 3000 por defecto.

## Licencia

Este proyecto está bajo la licencia MIT.
