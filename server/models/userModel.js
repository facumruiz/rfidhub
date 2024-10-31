import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  DNI: { type: String, required: true, unique: true, maxlength: 10 },
  nombre: { type: String, required: true, maxlength: 100 },
  cargo: {
    id: { type: String },
    nombre_cargo: { type: String, maxlength: 100 }
  },
  nacionalidad: {
    id: { type: String },
    num: { type: String, maxlength: 10 },
    pref: { type: String, maxlength: 10 },
    pais: { type: String, maxlength: 100 }
  },
  direccion: {
    calle: { type: String, maxlength: 255 },
    numero: { type: String, maxlength: 10 },
    codigo_postal: { type: String, maxlength: 10 },
    localidad: { type: String, maxlength: 100 },
    partido: { type: String, maxlength: 100 }
  },
  autenticacion: {
    uid_rfid: { type: String, required: true, maxlength: 50 }
  }
});



const User = mongoose.model('User', userSchema);
export default User;
