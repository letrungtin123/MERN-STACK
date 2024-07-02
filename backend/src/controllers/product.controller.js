import {
  createProductService,
  getAllProducts,
  getProductByIdService,
  updateProductService,
} from '../services/product.service.js';

import { HTTP_STATUS } from '../common/http-status.common.js';

// create category
export const createProduct = async (req, res) => {
  const body = req.body;

  const newProduct = await createProductService(body);
  if (!newProduct) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create product faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Create product success!', success: true, data: newProduct });
};

// get Products
export const getProducts = async (_, res) => {
  const result = await getAllProducts();

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get Products faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get Products success!', success: true, data: result });
};

// get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;

  const result = await getProductByIdService(id);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get product faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get product success!', success: true, data: result });
};

// update product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const result = await updateProductService(id, body);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update product faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update product success!', success: true, data: result });
};
