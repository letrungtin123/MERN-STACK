import { createProduct, getProductById, getProducts, updateProduct } from '../controllers/product.controller.js';

import { checkPermission } from '../middlewares/check-permission.middleware.js';
import express from 'express';
import { productMiddleware } from '../middlewares/product.middleware.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// create brand
router.post(
  '/product',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(createProduct),
);
// get all
router.get('/products', wrapRequestHandler(getProducts));
// get by id
router.get('/product/:id', wrapRequestHandler(getProductById));
// update
router.patch(
  '/product/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(updateProduct),
);

export default router;
