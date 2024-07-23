import Usuario from '../models/userModel.js';
import bcrypt from 'bcrypt';

const saltRounds = 10; 

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al obtener el usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
export const createUsuario = async (req, res) => {
  const { id_rol, nombre, apellido, email, password_hash } = req.body;
  try {
    //Debemos verificar que no exista ya un usuario con el mismo email ya que este campo será
    //una de las credenciales para el inicio de sesión.
    const existingUsuario = await Usuario.findOne({ where: { email } });
    if (existingUsuario) {
      return res.status(400).json({ error: 'El email ya está en uso' });
    }
    const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
    const newUsuario = await Usuario.create({ 
      id_rol, 
      nombre,
      apellido, 
      email, 
      password_hash: hashedPassword });
    res.status(201).json(newUsuario);
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
export const updateUsuario = async (req, res) => {
  const {id_rol, nombre, apellido, email, password_hash}=req.body;
  const {id} = req.params;
  try {
    const usuario= await Usuario.findByPk(id);
    if(usuario){
      usuario.id_rol=id_rol;
      usuario.nombre=nombre;
      usuario.apellido=apellido;
      usuario.email=email;
      usuario.password_hash=password_hash;
      await usuario.save();
      res.json(usuario);
    }
    else{
      req.status(404).json({error: 'Usuario no encontrado'})
    }
  } catch (err) {
    console.error("Error al actualizar el usuario: ",err);
    res.status(500).json({error: 'Error interno del servidor'})
  }
}
export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      await usuario.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al eliminar el usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};