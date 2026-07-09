import express from 'express';
import 'dotenv/config';
import app from './src/app.js';

app.listen(process.env.PORT || 8081, () => {
    console.log('Server running at http://localhost:' + (process.env.PORT || 8081));
});
