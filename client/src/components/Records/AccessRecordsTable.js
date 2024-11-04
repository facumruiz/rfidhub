// src/components/AccessRecordsTable.js

import React, { useEffect, useState } from 'react';
import { userApi } from '../../api'; // Asegúrate de que esta ruta sea correcta
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importar Bootstrap

const AccessRecordsTable = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false); // Estado para manejar el error de autorización

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage

    if (!token) {
      setUnauthorized(true); // Si no hay token, muestra un error de autorización
      setLoading(false);
      return;
    }

    const fetchRecordsAndUsers = async () => {
      try {
        const [recordsResponse, usersResponse] = await Promise.all([
          userApi.fetchAccessRecords(),
          userApi.fetchUsers(), // Asegúrate de que este método exista
        ]);

        // Verifica que las respuestas sean arrays antes de asignarlas al estado
        const recordsData = Array.isArray(recordsResponse.data) ? recordsResponse.data : [];
        const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];

        setRecords(recordsData);
        setUsers(usersData);
      } catch (error) {
        setError('Error al obtener los registros de acceso o los usuarios');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordsAndUsers();
  }, []);

  const getUserDetailsByUid = (uid) => {
    if (!users || users.length === 0) {
      return { nombre: 'Desconocido', dni: 'N/A' }; // Devuelve 'Desconocido' y 'N/A' si no hay usuarios
    }
    const user = users.find((user) => user.autenticacion && user.autenticacion.uid_rfid === uid);
    return user ? { nombre: user.nombre, dni: user.DNI || 'N/A' } : { nombre: 'Desconocido', dni: 'N/A' }; // Devuelve el nombre y DNI del usuario
  };

  if (unauthorized) {
    return <div className="text-danger text-center">No estás autorizado. Por favor, inicia sesión.</div>; // Mensaje de error si no hay token
  }

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Registros de Acceso</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(records) && records.length > 0 ? (
              records.map((record) => {
                const { nombre, dni } = getUserDetailsByUid(record.uid);
                return (
                  <tr key={record._id?.$oid || record._id}>
                    <td>{record.uid}</td>
                    <td>{nombre}</td> {/* Usa el nombre del usuario aquí */}
                    <td>{dni}</td> {/* Muestra el DNI */}
                    <td>{record.timestamp}</td> {/* Usa la función de formato de fecha si la implementas */}
                    <td>{record.result}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay registros disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessRecordsTable;
