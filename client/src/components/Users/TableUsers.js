import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { userApi } from '../../api';

const TableUsers = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    DNI: '',
    nombre: '',
    cargo: { id: '', nombre_cargo: '' },
    nacionalidad: { id: '', num: '', pref: '', pais: '' },
    direccion: { calle: '', numero: '', codigo_postal: '', localidad: '', partido: '' },
    autenticacion: { uid_rfid: '' },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseConfirm = () => setShowConfirm(false);
  const handleShowConfirm = (id) => {
    setUserIdToDelete(id);
    setShowConfirm(true);
  };

  const fetchUsers = async () => {
    try {
      const response = await userApi.fetchUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => {
      if (name.startsWith('cargo_')) {
        return {
          ...prevUser,
          cargo: {
            ...prevUser.cargo,
            [name.replace('cargo_', '')]: value,
          },
        };
      } else if (name.startsWith('autenticacion_')) {
        return {
          ...prevUser,
          autenticacion: {
            ...prevUser.autenticacion,
            [name.replace('autenticacion_', '')]: value,
          },
        };
      } else if (name.startsWith('direccion_')) {
        return {
          ...prevUser,
          direccion: {
            ...prevUser.direccion,
            [name.replace('direccion_', '')]: value,
          },
        };
      } else if (name.startsWith('nacionalidad_')) {
        return {
          ...prevUser,
          nacionalidad: {
            ...prevUser.nacionalidad,
            [name.replace('nacionalidad_', '')]: value,
          },
        };
      } else {
        return { ...prevUser, [name]: value };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newUser.DNI || !newUser.nombre || !newUser.autenticacion.uid_rfid) {
        alert("Todos los campos obligatorios deben estar completos.");
        return;
      }
      console.log(newUser);
      await userApi.createUser(newUser); // Cambiado a createUser
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await userApi.deleteUser(userIdToDelete);
      fetchUsers();
      handleCloseConfirm();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>Agregar Usuario</Button>

      {/* Modal para agregar usuario */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="DNI">
              <Form.Label>DNI</Form.Label>
              <Form.Control
                type="text"
                name="DNI"
                value={newUser.DNI}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newUser.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="cargo_nombre_cargo">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                name="cargo_nombre_cargo"
                value={newUser.cargo.nombre_cargo}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="nacionalidad_pais">
              <Form.Label>País</Form.Label>
              <Form.Control
                type="text"
                name="nacionalidad_pais"
                value={newUser.nacionalidad.pais}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="direccion_calle">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                name="direccion_calle"
                value={newUser.direccion.calle}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="direccion_numero">
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                name="direccion_numero"
                value={newUser.direccion.numero}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="autenticacion_uid_rfid">
              <Form.Label>UID RFID</Form.Label>
              <Form.Control
                type="text"
                name="autenticacion_uid_rfid"
                value={newUser.autenticacion.uid_rfid}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para eliminar usuario */}
      <Modal show={showConfirm} onHide={handleCloseConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este usuario?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirm}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tabla de usuarios */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>UID RFID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.map((user) => (
            <tr key={user._id}>
              <td>{user.DNI}</td>
              <td>{user.nombre}</td>
              <td>{user.cargo.nombre_cargo}</td>
              <td>{user.autenticacion.uid_rfid}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleShowConfirm(user._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableUsers;
