import authRoutes from './auth.routes.js';
import express from 'express';

const router = express.Router();

const rootRoutes = [authRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default router;