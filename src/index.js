import express from 'express';
import sequelize from './config/sequelize.js';
import usuarioRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js'
import clientRoutes from './routes/clientRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import tipoEquipoRoutes from './routes/tipoEquipoRoutes.js';
import brandModelRoutes from './routes/brandModelRoutes.js';
import equipoRoutes from './routes/equipoRoutes.js';
import productRoutes from './routes/productRoutes.js';
import productCategoryRoutes from './routes/productCategoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import serviceCategoryRoutes from './routes/serviceCategoryRoutes.js';
import ordenTrabajoRoutes from './routes/ordenTrabajoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import plantillaRoutes from './routes/plantillaRoutes.js';
import accesorioRoutes from './routes/accesorioRoutes.js';
import plantillaOrdenRoutes from './routes/plantillaOrdenRoutes.js';
import productoOrdenRoutes from './routes/productoOrdenRoutes.js';
import servicioOrdenRoutes from './routes/servicioOrdenRoutes.js';
import tareaOrdenRoutes from './routes/tareaOrdenRoutes.js';
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
app.use('/auth', authRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', roleRoutes); 
app.use('/api', clientRoutes); 
app.use('/api', brandRoutes); 
app.use('/api', modelRoutes); 
app.use('/api', tipoEquipoRoutes); 
app.use('/api', equipoRoutes); 
app.use('/api', brandModelRoutes);
app.use('/api', productRoutes);
app.use('/api', productCategoryRoutes);
app.use('/api', serviceRoutes);
app.use('/api', serviceCategoryRoutes);
app.use('/api', ordenTrabajoRoutes);
app.use('/api', tareaRoutes);
app.use('/api', plantillaRoutes);
app.use('/api', accesorioRoutes);
app.use('/api', plantillaOrdenRoutes);
app.use('/api', productoOrdenRoutes);
app.use('/api', servicioOrdenRoutes);
app.use('/api', tareaOrdenRoutes);


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
