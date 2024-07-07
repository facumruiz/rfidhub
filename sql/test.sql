-- Ejemplo de inserción en la tabla Cargos
INSERT IGNORE INTO Cargos (nombre_cargo) VALUES 
    ('Supervisor'),
    ('Analista'),
    ('Asistente');

-- Ejemplo de inserción en la tabla Nacionalidad
INSERT IGNORE INTO Nacionalidad (num, pref, pais) VALUES 
    ('456', '+44', 'Reino Unido'),
    ('789', '+33', 'Francia'),
    ('012', '+49', 'Alemania');

-- Ejemplo de inserción en la tabla Usuarios
INSERT IGNORE INTO Usuarios (DNI, nombre, cargo_id, nacionalidad_id) VALUES 
    ('12345678', 'Juan Pérez', 2, 1),
    ('98765432', 'María García', 3, 2),
    ('45678901', 'Pedro López', 1, 3);

-- Ejemplo de inserción en la tabla Direccion
INSERT INTO Direccion (usuario_DNI, calle, numero, codigo_postal, localidad, partido) VALUES 
    ('12345678', 'Avenida Principal', '100', '12345', 'Ciudad Principal', 'Partido Principal'),
    ('98765432', 'Calle Secundaria', '200', '54321', 'Ciudad Secundaria', 'Partido Secundario'),
    ('45678901', 'Boulevard Terciario', '300', '67890', 'Ciudad Terciaria', 'Partido Terciario');

-- Ejemplo de inserción en la tabla Autenticacion
INSERT INTO Autenticacion (uid_rfid, DNI) VALUES 
    ('123456789012', '12345678'),
    ('987654321098', '98765432'),
    ('456789012345', '45678901');
