import express from 'express';
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  getOrderStatusController,
} from '../controllers/authController.js';
import { reqSignIn, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

//forget password

router.post('/forgot-password', forgotPasswordController);

// protected routes

router.get('/protected', reqSignIn, isAdmin, testController);

router.get('/user-auth', reqSignIn, async (req, res) => {
  res.status(200).send({ ok: true });
});

router.get('/admin-auth', reqSignIn, async (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile

router.put('/update-profile', reqSignIn, updateProfileController);

router.get('/orders', reqSignIn, getOrdersController);

router.get('/all-orders', reqSignIn, isAdmin, getAllOrdersController);

router.put(
  '/order-status/:orderId',
  reqSignIn,
  isAdmin,
  getOrderStatusController
);

export default router;
