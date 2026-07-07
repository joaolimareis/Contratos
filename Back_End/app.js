import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../Front_End' });
});


export default app;