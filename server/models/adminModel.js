import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const { Schema } = mongoose;

const adminSchema = new Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
        maxlength: [50, 'El nombre de usuario no puede exceder los 50 caracteres'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        match: [/.+@.+\..+/, 'Por favor ingresa un correo electrónico válido'],
        unique: true,
    },
    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
    },

    isValidated: {
        type: Boolean,
        default: false, // Por defecto en 'false' hasta que el usuario sea validado
    },

});



// Método para comparar contraseñas
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware para encriptar la contraseña antes de guardar el usuario
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
