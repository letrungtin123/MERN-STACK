import Category from '../models/category.model.js';

export const createCategoryService = async (body) => {
  const newBrand = await Category.create(body);

  return newBrand;
};

// get all categories
export const getAllCategories = async () => {
  const categories = await Category.find();

  return categories;
};

// get category by id
export const getCategoryByIdService = async (id) => {
  const category = await Category.findById({ _id: id });

  return category;
};

// update category
export const updateCategoryService = async (id, body) => {
  const category = await Category.findByIdAndUpdate({ _id: id }, body, { new: true });
  return category;
};
