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

dotenv.config();

const app = express();

connectDB();

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
  console.log(`listening on ${process.env.DEV_MODE} port on ` + PORT);
});
