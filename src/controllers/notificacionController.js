import Notificacion from '../models/notificacionModel.js';

export const crearNotificacion = async (id_usuario, id_referencia, mensaje) => {
  try {
    const notificacion = await Notificacion.create({
      id_usuario,
      id_referencia,
      mensaje,
    });
    return notificacion;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};
export const getNotificaciones = async (req, res) => {
    const { userId } = req.params;
    try {
      const notificaciones = await Notificacion.findAll({
        where: {
          id_usuario: userId,
          leida: false,
        },
        order: [['created_at', 'DESC']],
      });
      res.status(200).json(notificaciones);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
};
export const readNotificacion = async (req, res) => {
    const { id_notificacion } = req.params; // Extraer el ID de la notificación desde los parámetros
    try {
        // Buscar la notificación por su ID
        const notificacion = await Notificacion.findByPk(id_notificacion);

        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        // Actualizar el campo "leida" a true
        await notificacion.update({ leida: true });

        return res.status(200).json({ message: 'Notificación actualizada correctamente', notificacion });
    } catch (error) {
        console.error('Error al actualizar notificación:', error);
        res.status(500).json({ message: 'Error al actualizar la notificación' });
    }
};
