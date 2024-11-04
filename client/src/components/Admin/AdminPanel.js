// src/components/AdminPanel.js

import React, { useEffect, useState } from 'react';
import { userApi } from '../../api'; // Importa el objeto userApi
import { Button, Modal, Form } from 'react-bootstrap';
import { FaTrash, FaPencilAlt } from 'react-icons/fa'; // Importa los íconos

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejo de carga
  const [error, setError] = useState(null); // Estado para manejo de errores

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await userApi.fetchAdmin();
        const usersData = Array.isArray(response.data) ? response.data : []; // Verifica que sea un array
        setUsers(usersData);
      } catch (error) {
        setError("Error al obtener la lista de usuarios"); // Manejo de error
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await userApi.deleteUser(selectedUser._id); // Llama a deleteUser desde userApi
        setUsers(users.filter(user => user._id !== selectedUser._id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleRoleChange = async () => {
    if (selectedUser) {
      try {
        await userApi.updateAdminRole(selectedUser._id, selectedRole); // Llama a updateAdminRole desde userApi
        setUsers(users.map(user => 
          user._id === selectedUser._id ? { ...user, role: selectedRole } : user
        ));
        setShowRoleModal(false);
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    }
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmRoleChange = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  return (
    <div className="container">
      <h4>Usuarios</h4>
      <ul className="list-group">
        {users.length > 0 ? (
          users.map(user => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{user.username}</strong> ({user.role})
              </div>
              {user.email}
              <div>
                <Button variant="primary" onClick={() => confirmRoleChange(user)} className="me-2">
                  <FaPencilAlt /> {/* Icono de lápiz */}
                </Button>
                <Button variant="danger" onClick={() => confirmDelete(user)}>
                  <FaTrash /> {/* Icono de bote de basura */}
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">No hay usuarios disponibles</li>
        )}
      </ul>

      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser?.username}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para cambiar el rol */}
      <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Rol de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserRole">
              <Form.Label>Seleccionar Nuevo Rol</Form.Label>
              <Form.Control 
                as="select" 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoleModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleRoleChange}>Cambiar Rol</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
