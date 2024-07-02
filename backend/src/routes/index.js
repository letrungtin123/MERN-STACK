import authRoutes from './auth.routes.js';
import brandRoutes from './brand.routes.js';
import categoryRoutes from './category.routes.js';
import express from 'express';
import imageRoutes from './upload-image.routes.js';
import userRoutes from './user.routes.js';

const router = express.Router();

const rootRoutes = [authRoutes, userRoutes, brandRoutes, categoryRoutes, imageRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default router;