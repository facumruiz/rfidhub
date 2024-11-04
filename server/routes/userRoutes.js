// routes/userRoutes.js

import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas para el CRUD de usuarios
router.post('/', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['employee', 'admin']), createUser); // Crear usuario
router.get('/', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['employee', 'admin']), getAllUsers); // Obtener todos los usuarios
router.get('/:id', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['employee', 'admin']), getUserById); // Obtener usuario por DNI
router.put('/:id', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['employee', 'admin']), updateUser); // Actualizar usuario
router.delete('/:id', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['employee', 'admin']), deleteUser); // Eliminar usuario

export default router; // Exportación por defecto
