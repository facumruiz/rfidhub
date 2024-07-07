DELIMITER //
CREATE PROCEDURE AutenticarUsuario(IN uid_rfid_input VARCHAR(50), OUT resultado INT)
BEGIN
    DECLARE usuario_DNI VARCHAR(10);

    -- Verificar si el uid_rfid existe en la tabla Autenticacion
    SELECT DNI INTO usuario_DNI
    FROM Autenticacion
    WHERE uid_rfid = uid_rfid_input;

    -- Si no se encuentra el uid_rfid, establecer resultado a 0
    IF usuario_DNI IS NULL THEN
        SET resultado = 0;
    ELSE
        -- Si se encuentra el uid_rfid, insertar un nuevo registro en la tabla Registros y establecer resultado a 1
        INSERT INTO Registros (DNI, fecha_hora)
        VALUES (usuario_DNI, NOW());
        SET resultado = 1;
    END IF;
END //
DELIMITER ;
