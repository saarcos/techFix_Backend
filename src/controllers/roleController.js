import Rol from "../models/roleModel.js";
import { z } from 'zod';

const rolSchema = z.object({
    nombrerol: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no debe exceder 50 caracteres')
});

export const getAllRoles = async (req, res) =>{
    try {
        const roles = await Rol.findAll(); 
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
export const getRoleById = async (req, res) =>{
    const {id} = req.params
    try {
        const rol = await Rol.findByPk(id); 
        if(rol){
            res.json(rol);
        }
        else{
            res.status(404).json({ error: 'Rol no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el rol:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}