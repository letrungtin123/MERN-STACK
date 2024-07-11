import authRoutes from './auth.routes.js';
import brandRoutes from './brand.routes.js';
import categoryRoutes from './category.routes.js';
import express from 'express';
import userRoutes from './user.routes.js';

// import imageRoutes from './upload-image.routes.js';


const router = express.Router();

const rootRoutes = [authRoutes, userRoutes, brandRoutes, categoryRoutes];

rootRoutes.map((route) => {
  router.use(route);
});

export default router;