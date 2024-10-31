import express from 'express';
import { verifyRole } from '../middleware/authMiddleware.js';
import { createAdmin, getAllAdmin, validateAdmin, getAdminById, updateAdmin, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

/**
 * @openapi
 * /admin:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error del servidor
 */



router.get('/', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['admin']), getAllAdmin);

/**
 * @openapi
 * /admin/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id',(req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['admin']), getAdminById);

/**
 * @openapi
 * /admin:
 *   post:
 *     tags:
 *       - User
 *     summary: Crear un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post('/', createAdmin);

/**
 * @openapi
 * /admin/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Autenticación de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', validateAdmin);

/**
 * @openapi
 * /admin/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Actualizar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/:id', (req, res, next) => req.app.verifyToken(req, res, next), verifyRole(['admin']), updateAdmin);

/**
 * @openapi
 * /admin/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteAdmin);

export default router;
