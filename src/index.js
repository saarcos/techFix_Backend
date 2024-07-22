import express from 'express';
import sequelize from './config/sequelize.js';
import usuarioRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Usar las rutas definidas
app.use('/api', usuarioRoutes);

// Sincronizar con la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

sequelize.sync()
  .then(() => {
    console.log('Modelo sincronizado con la base de datos.');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar el modelo con la base de datos:', err);
  });
