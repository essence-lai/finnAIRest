import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

//[GET][id]: returns randomly generated unique identifier
router.get('/', (req, res) => res.send(uuidv4()));

export default router;