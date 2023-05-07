import express from 'express';
import { isAdmin, reqSignIn } from '../middlewares/authMiddleware.js';
import {
  categoryController,
  categoryUpdateController,
  deleteCategoryController,
  getAllCategoryController,
  getSingleCategoryController,
} from '../controllers/categoryController.js';

const router = express.Router();

router.post('/create-category', reqSignIn, isAdmin, categoryController);

router.put(
  '/update-category/:id',
  reqSignIn,
  isAdmin,
  categoryUpdateController
);

router.get('/get-category', getAllCategoryController);

router.get('/single-category/:slug', getSingleCategoryController);

router.delete(
  '/delete-category/:id',
  reqSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
