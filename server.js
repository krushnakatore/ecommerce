// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRouter.js';
import cors from 'cors';
import categoryRoutes from './routes/catergoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const app = express();

connectDB();
//filemodule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './e_commerce/build')));

//routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

app.use('*', function (req, res) {
  res.sendFile(path.join(__dirname, './e_commerce/build/index.html'));
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`listening on port on ` + PORT);
});
