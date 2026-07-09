import express from 'express';
import casaRoutes from './routes/casaRoutes.js';
const app = express();

app.use(express.json());



// Routes
app.use(casaRoutes);
export default app;