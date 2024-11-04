import Admin from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuración del transporte de correo (ejemplo usando Gmail)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const createAdmin = async (req, res) => {
    try {
        const newUser = new Admin(req.body);

        // Guardar el usuario
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation error', errors: err.errors });
        } else if (err.code === 11000) {
            // Error de clave duplicada
            res.status(409).json({ message: 'El correo electrónico ya está en uso. Por favor, prueba con otro.' });
        } else {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
};


const getAllAdmin = async (req, res) => {
    try {
        const users = await Admin.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const getAdminById = async (req, res) => {
    try {
        const user = await Admin.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const validateAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Admin.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Usuario o contraseña no válidos' });

        // Verificar si el usuario está validado
        if (!user.isValidated) return res.status(403).json({ message: 'La cuenta no ha sido validada.' });

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Usuario o contraseña no válidos' });

        // Generar token JWT
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, req.app.get("secretKey"), { expiresIn: '1h' });

        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
};



const updateAdmin = async (req, res) => {
    try {
        const user = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation error', errors: err.errors });
        } else {
            res.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
};

const deleteAdmin = async (req, res) => {
    try {
        const result = await Admin.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export { createAdmin, getAllAdmin, validateAdmin, getAdminById, updateAdmin, deleteAdmin };
