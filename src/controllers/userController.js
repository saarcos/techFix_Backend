import Usuario from '../models/userModel.js';
import Rol from '../models/roleModel.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const saltRounds = 10; 
// Definición de esquema de Zod para validar el usuario
const usuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no debe exceder 50 caracteres'),
  apellido: z.string().min(1, 'El apellido es obligatorio').max(100, 'El apellido no debe exceder 100 caracteres'),
  email: z.string().email('Email inválido'),
  password_hash: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  id_rol: z.number().int()
});

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: {
        model: Rol,
        as: 'rol',
        attributes: ['nombrerol'], // Solo incluye el nombre del rol
      },
    });
    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      include: {
        model: Rol,
        as: 'rol',
        attributes: ['nombrerol'], // Solo incluye el nombre del rol
      },
    });
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
  try {
    //Validación de datos de entrada
    const resultado = usuarioSchema.safeParse(req.body);
    if(!resultado.success){
      return res.status(400).json({ error: resultado.error.errors });
    }
    const { id_rol, nombre, apellido, email, password_hash } = resultado.data;
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
     const { password_hash: _, ...userWithoutPassword } = newUsuario.toJSON();
     res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
export const updateUsuario = async (req, res) => {
  const {id} = req.params;
  try {
    // Validar los datos de entrada
    const result = usuarioSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const { nombre, apellido, email, password_hash, id_rol } = result.data;
    const usuario= await Usuario.findByPk(id);
    if(usuario){
      const hashedPassword = await bcrypt.hash(password_hash, saltRounds);
      usuario.id_rol=id_rol;
      usuario.nombre=nombre;
      usuario.apellido=apellido;
      usuario.email=email;
      usuario.password_hash=hashedPassword;
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
