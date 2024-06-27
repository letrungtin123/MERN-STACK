import { createBrand, deleteBrand, getBrand, getBrandById, updateBrandById } from '../controllers/brand.controller';

import express from 'express';

const router = express.Router();

router.post('/brands', createBrand);
router.get('/brands', getBrand);
router.get('/brands/:id', getBrandById);
router.delete('/brands/:id', deleteBrand);
router.patch('/brands/:id', updateBrandById);

export default router;
