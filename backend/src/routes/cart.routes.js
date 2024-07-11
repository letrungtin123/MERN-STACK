import { addToCartMiddleware } from '../middlewares/cart.middleware.js';
import { cartController } from '../controllers/cart.controller.js';
import express from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handlers.util.js';

const router = express.Router();

// add to cart
router.post(
  '/cart',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(addToCartMiddleware),
  wrapRequestHandler(cartController.addCart),
);

// get carts by userId
router.get('/cart', wrapRequestHandler(verifyToken), wrapRequestHandler(cartController.getCartByUserId));

export default router;