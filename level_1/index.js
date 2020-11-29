import express from 'express';
import bodyParser from 'body-parser';

import usersRoutes from './routes/users.js';
import idRoutes from './routes/id.js'

const app = express(),
    PORT = 5000;

app.use(bodyParser.json());

app.use('/users', usersRoutes);
app.use('/id', idRoutes);

// GET HOME ROUTE; Returns a hello message
app.get('/', (req, res) => res.send('Hi FinnAI'));

//GET ID: Returns universally unique identifier

app.listen(PORT, () => console.log(`Server is running on port: http://localhost:${ PORT }`));
