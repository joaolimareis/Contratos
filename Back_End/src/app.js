import express from 'express';
import casasRoutes from './routes/casasRoutes.js';
const app = express();

app.use(express.json());



// Routes
app.use('/api', casasRoutes);
export default app;