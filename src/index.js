import express from 'express';
import http from 'http'; // Importar para crear el servidor HTTP
import { Server } from 'socket.io'; // Importar el servidor de Socket.IO
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
import accesorioRoutes from './routes/accesorioRoutes.js';
import almacenRoutes from './routes/almacenRoutes.js'
import existenciasRoutes from './routes/existenciasRoutes.js'
import detalleOrdenRoutes from './routes/detalleOrdenRoutes.js'
import notificacionesRoutes from './routes/notificacionesRoutes.js'
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
// Crear el servidor HTTP y conectar Socket.IO
const server = http.createServer(app); // Usar HTTP para conectar con Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // La URL del frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    credentials: true, // Permitir credenciales
  },
});
// Middleware global para Socket.IO
app.use((req, res, next) => {
  req.io = io; // Adjuntar Socket.IO al objeto req
  next();
});

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
app.use('/api', accesorioRoutes);
app.use('/api', almacenRoutes);
app.use('/api', existenciasRoutes);
app.use('/api', detalleOrdenRoutes);
app.use('/api', notificacionesRoutes);

const users = {}; // Objeto para guardar el mapeo userId -> socketId

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Registrar al usuario cuando se conecte
    socket.on('register', (userId) => {
        users[userId] = socket.id; // Relacionar el userId con el socketId
        console.log(`Usuario registrado: ${userId}, socket: ${socket.id}`);
    });

    // Eliminar al usuario cuando se desconecte
    socket.on('disconnect', () => {
        for (const [userId, socketId] of Object.entries(users)) {
            if (socketId === socket.id) {
                delete users[userId];
                console.log(`Usuario desconectado: ${userId}`);
                break;
            }
        }
    });

    // Escuchar el evento de asignación de órdenes
    socket.on('asignarOrden', ({ userId, ordenId }) => {
        const socketId = users[userId];
        if (socketId) {
            io.to(socketId).emit('ordenAsignada', {
                id_orden: ordenId,
                message: `Se te ha asignado una nueva orden de trabajo con ID ${ordenId}.`,
            });
        } else {
            console.log(`El usuario con ID ${userId} no está conectado.`);
        }
    });
});

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
    server.listen(process.env.PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar el modelo con la base de datos:', err);
});
export { io }; // Exportar io para usar en controladores si es necesario

