import Product from "../models/product.model";

export const createProductService = async (body) => {
  const newProduct = await Product.create(body);

  return newProduct;
};

// get all Products
export const getAllProducts = async () => {
  const products = await Product.find();

  return products;
};

// get Product by id
export const getProductByIdService = async (productId) => {
  const product = await Product.findById({ _id: productId });

  return product;
};

// update product
export const updateProductService = async (productId, body) => {
  const product = await Product.findByIdAndUpdate({ _id: productId }, body, { new: true });
  return product;
};