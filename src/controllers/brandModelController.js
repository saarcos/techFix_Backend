import Marca from '../models/brandModel.js';
import Modelo from '../models/modelModel.js';
import sequelize from '../config/sequelize.js';

export const createBrandAndModel = async (req, res) => {
  const { marcaNombre, modeloNombre } = req.body;

  const transaction = await sequelize.transaction();

  try {
    // Crear la nueva marca
    const nuevaMarca = await Marca.create({
      nombre: marcaNombre
    }, { transaction });

    // Crear el nuevo modelo asociado a la marca
    const nuevoModelo = await Modelo.create({
      nombre: modeloNombre,
      id_marca: nuevaMarca.id_marca
    }, { transaction });

    // Si todo va bien, confirmar la transacción
    await transaction.commit();

    res.status(201).json({
      message: 'Marca y Modelo creados exitosamente',
      marca: nuevaMarca,
      modelo: nuevoModelo
    });

  } catch (error) {
    // Si ocurre un error, revertir la transacción
    await transaction.rollback();
    res.status(500).json({
      message: 'Error al crear Marca y Modelo',
      error: error.message
    });
  }
};
