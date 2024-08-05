import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../models/userModel.js';
import 'dotenv/config';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const validPassword = await bcrypt.compare(password, usuario.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol, email: usuario.email, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      });
    res.status(200).json({ 
      message: 'Autenticación exitosa',
      token: token,
      user: {
        id: usuario.id_usuario,
        nombre: usuario.nombre, 
        email: usuario.email,
        id_rol: usuario.id_rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    });
  res.status(200).json({ message: 'Logout exitoso' });
};

