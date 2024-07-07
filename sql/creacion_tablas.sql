CREATE DATABASE IF NOT EXISTS AccesoRFID;
USE AccesoRFID;

-- Tabla de Cargos
CREATE TABLE IF NOT EXISTS Cargos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cargo VARCHAR(100)
);

-- Tabla de Nacionalidad
CREATE TABLE IF NOT EXISTS Nacionalidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    num VARCHAR(10),
    pref VARCHAR(10),
    pais VARCHAR(100)
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    DNI VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100),
    cargo_id INT,
    nacionalidad_id INT,
    FOREIGN KEY (cargo_id) REFERENCES Cargos(id),
    FOREIGN KEY (nacionalidad_id) REFERENCES Nacionalidad(id)
);

-- Tabla de Dirección
CREATE TABLE IF NOT EXISTS Direccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_DNI VARCHAR(10),
    calle VARCHAR(255),
    numero VARCHAR(10),
    codigo_postal VARCHAR(10),
    localidad VARCHAR(100),
    partido VARCHAR(100),
    FOREIGN KEY (usuario_DNI) REFERENCES Usuarios(DNI)
);

-- Tabla de Autenticación
CREATE TABLE IF NOT EXISTS Autenticacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid_rfid VARCHAR(50) UNIQUE,
    DNI VARCHAR(10),
    FOREIGN KEY (DNI) REFERENCES Usuarios(DNI)
);

-- Tabla de Registros
CREATE TABLE IF NOT EXISTS Registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    DNI VARCHAR(10),
    fecha_hora TIMESTAMP,
    FOREIGN KEY (DNI) REFERENCES Usuarios(DNI)
);
