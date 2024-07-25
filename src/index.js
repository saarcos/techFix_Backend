import express from 'express';
import sequelize from './config/sequelize.js';
import usuarioRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(cookieParser());
// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // La URL de tu frontend de Vite
  credentials: true, // Para permitir cookies de origen cruzado
};

app.use(cors(corsOptions));

// Usar las rutas definidas
app.use('/api', usuarioRoutes);
app.use('/auth', authRoutes);

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
    app.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar el modelo con la base de datos:', err);
  });
