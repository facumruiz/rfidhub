# Sistema de Autenticación RFID con Express, MQTT y MySQL
El proyecto de Backend de autenticación RFID se centra en desarrollar una API robusta para gestionar el acceso mediante tarjetas RFID. Utilizando tecnologías como Node.js, Express, MQTT y MySQL, esta API permite registrar usuarios, administrar autenticaciones basadas en RFID y consultar registros de acceso en tiempo real. Integrando [Socket.IO](http://socket.io/), se facilita la comunicación bidireccional para actualizar la interfaz de usuario en tiempo real con eventos MQTT.

# **Estructura del Proyecto**

```jsx
project-root/
│
├── api/
│   ├── .env
│   ├── package.json
│   ├── public/
│   ├── routes/
│   │   ├── admin.js
│   │   └── registros.js
│   ├── controllers/
│   │   └── userController.js
│   ├── config/
│   │   ├── db.js
│   │   └── mqtt.js
│   ├── server.js
│   └── README.md
└── sql/
├── schema.sql
└── README.md

```

## Descripción de Componentes

- **api/config/mqtt.js**: Configuración para la conexión MQTT.
- **api/controllers/userController.js**: Controlador para la lógica de negocio de autenticación de usuarios.
- **api/routes/admin.js**: Rutas para la administración de usuarios y autenticaciones.
- **api/routes/registros.js**: Rutas para consultar registros.
- **api/server.js**: Configuración del servidor Express y [Socket.IO](http://socket.io/) para la comunicación en tiempo real.

### Configuraciones Importantes

- MySQL: Almacena datos de usuarios, autenticaciones y registros.
- MQTT: Comunicación de resultados de autenticación en tiempo real.
- Express y EJS: Servidor web y renderización de vistas.

### Endpoints Principales

- `GET /admin`: Renderiza la página de administración con usuarios y autenticaciones.
- `POST /admin/users`: Agrega un nuevo usuario a la base de datos.
- `POST /admin/auth`: Agrega una nueva autenticación de usuario mediante RFID.
- `DELETE /admin/auth/:uid_rfid`: Elimina una autenticación basada en el UID RFID proporcionado.
- `GET /`: Muestra registros paginados con filtro opcional por fecha.

### Funcionalidades Clave

- Autenticación de Usuario: Utiliza MQTT para recibir y procesar datos RFID en tiempo real.
- Administración de Usuarios: Permite agregar y listar usuarios, así como gestionar autenticaciones.

### Requerimientos para Correr el Proyecto

1. **Node.js y npm**: Instala Node.js desde su sitio oficial.
2. **Variables de Entorno**: Crea un archivo `.env` en el directorio `api/` con las siguientes variables:
    
    ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=usuario_mysql
    DB_PASSWORD=contraseña_mysql
    DB_NAME=AccesoRFID
    MQTT_BROKER_URL=tu_url_broker_mqtt
    MQTT_TOPIC=tu_topico_mqtt
    MQTT_RESULT_TOPIC=tu_topico_resultado_mqtt
    
    ```
    

### Configuración Inicial

1. **Instalar Dependencias**: Ejecuta `npm install` en la raíz del proyecto.

### Ejecución del Servidor

1. **Iniciar Servidor**: Ejecuta npm start en la raíz del proyecto. El servidor se ejecutará en http://localhost:3000 (o el puerto definido en las variables de entorno).
