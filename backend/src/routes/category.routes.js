import { createCategory, deleteCategory, getCategory, getCategoryById, updateCategoryById } from '../controllers/category.controller';

import express from 'express';

const router = express.Router();

router.post('/categories', createCategory);
router.get('/categories', getCategory);
router.get('/categories/:id', getCategoryById);
router.delete('/categories/:id', deleteCategory);
router.patch('/categories/:id', updateCategoryById);

export default router;
