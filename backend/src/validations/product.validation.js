import joi from 'joi';

export const productValidation = joi.object({
  nameProduct: joi.string().required().messages({
    'string.empty': 'Product name is required',
    'any.required': 'Product name is required',
  }),
  price: joi.number().required().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is required',
  }),
  desc: joi.string(),
  brand: joi.string().required().messages({
    'string.empty': 'Brand is required',
    'any.required': 'Brand is required',
  }),
  category: joi.string().required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required',
  }),
  status: joi.string().valid('active', 'inactive').default('active'),
  colors: joi.array().items(
    joi.object({
      color: joi.string().required(),
      quantity: joi.number().required(),
    }),
  ),
  sizes: joi.array().items(
    joi.object({
      size: joi.string().required(),
      quantity: joi.number().required(),
    }),
  ),
  images: joi.array().items(joi.string().required()),
});