# AccesoRFID

Este esquema de base de datos MySQL, denominado AccesoRFID, se utiliza para gestionar el acceso mediante tarjetas RFID. Proporciona estructuras para almacenar información sobre usuarios, cargos, direcciones, nacionalidades, autenticaciones y registros de acceso.

## Tablas

### Cargos

Esta tabla almacena información sobre los cargos que pueden tener los usuarios.

| Campo       | Tipo         | Descripción                 |
|-------------|--------------|-----------------------------|
| id          | INT          | Identificador único         |
| nombre_cargo| VARCHAR(100) | Nombre del cargo            |

### Nacionalidad

Esta tabla guarda información sobre las nacionalidades de los usuarios.

| Campo       | Tipo         | Descripción                 |
|-------------|--------------|-----------------------------|
| id          | INT          | Identificador único         |
| num         | VARCHAR(10)  | Número de país              |
| pref        | VARCHAR(10)  | Prefijo internacional      |
| pais        | VARCHAR(100) | Nombre del país             |

### Usuarios

La tabla Usuarios contiene detalles de los usuarios.

| Campo            | Tipo         | Descripción                 |
|------------------|--------------|-----------------------------|
| DNI              | VARCHAR(10)  | Documento de identidad     |
| nombre           | VARCHAR(100) | Nombre del usuario          |
| cargo_id         | INT          | ID del cargo (clave foránea)|
| nacionalidad_id  | INT          | ID de la nacionalidad (clave foránea)|

### Direccion

Esta tabla almacena la información de dirección de los usuarios.

| Campo       | Tipo         | Descripción                 |
|-------------|--------------|-----------------------------|
| id          | INT          | Identificador único         |
| usuario_DNI | VARCHAR(10)  | DNI del usuario (clave foránea) |
| calle       | VARCHAR(255) | Nombre de la calle           |
| numero      | VARCHAR(10)  | Número de la dirección      |
| codigo_postal| VARCHAR(10) | Código postal               |
| localidad   | VARCHAR(100) | Nombre de la localidad      |
| partido     | VARCHAR(100) | Nombre del partido          |

### Autenticacion

Esta tabla guarda información sobre las autenticaciones de los usuarios.

| Campo       | Tipo         | Descripción                 |
|-------------|--------------|-----------------------------|
| id          | INT          | Identificador único         |
| uid_rfid    | VARCHAR(50)  | UID RFID                    |
| DNI         | VARCHAR(10)  | DNI del usuario (clave foránea) |

### Registros

Esta tabla registra los accesos de los usuarios.

| Campo       | Tipo         | Descripción                 |
|-------------|--------------|-----------------------------|
| id          | INT          | Identificador único         |
| DNI         | VARCHAR(10)  | DNI del usuario (clave foránea) |
| fecha_hora  | TIMESTAMP    | Fecha y hora del acceso     |

## Notas

- Asegúrate de establecer la base de datos como "AccesoRFID" antes de ejecutar el script.
- Los scripts SQL están diseñados para ejecutarse secuencialmente para crear la estructura de la base de datos y las tablas junto con las relaciones necesarias.
