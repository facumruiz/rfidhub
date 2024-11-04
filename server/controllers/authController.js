import User from '../models/userModel.js'; // Importa el modelo de usuario

export const verifyUid = async (uid) => {
  try {
    const user = await User.findOne({ 'autenticacion.uid_rfid': uid });
    return user ? 1 : 0;
  } catch (error) {
    throw new Error('Error en la autenticación');
  }
};
