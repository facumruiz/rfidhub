// routes/accessRoutes.js
import express from 'express';
import AccessRecord from '../models/recordModel.js';

import { verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta para obtener todos los registros de acceso
router.get('/', (req, res, next) => req.app.verifyToken(req, res, next),
verifyRole(['employee', 'admin']), async (req, res) => {
  try {
    const accessRecords = await AccessRecord.find();
    res.status(200).json(accessRecords);
  } catch (error) {
    console.error('Error al obtener los registros de acceso:', error);
    res.status(500).json({ message: 'Error al obtener los registros de acceso' });
  }
});

export default router;
