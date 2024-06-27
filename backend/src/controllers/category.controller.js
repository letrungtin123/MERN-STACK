import Category from '../models/category.model.js';
import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleAsync } from '../utils/trycatch.js';

// tạo danh mục
export const createCategory = handleAsync(async (req, res) => {
	const body = req.body;
	const category = await Category.create(body);

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'create category failed' });
	}

	return res.status(HTTP_STATUS.CREATED).json({
		message: 'create category successfully',
		data: category,
	});
});

// lấy ra danh sách danh mục
export const getCategory = handleAsync(async (req, res) => {
	const category = await Category.find();

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'get category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'get category sucessfully',
		data: category,
	});
});

// lấy ra danh sách danh mục theo id
export const getCategoryById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findById(id);

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'get category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'get category sucessfully',
		data: category,
	});
});

// xóa danh mục
export const deleteCategory = handleAsync(async (req, res) => {
	const { id } = req.params;
	const category = await Category.findByIdAndDelete(id);

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'delete category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'delete category sucessfully',
		data: category,
	});
});

// cập nhật danh mục
export const updateCategoryById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	const category = await Category.findByIdAndUpdate(id, body, { new: true });

	if (!category) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'update category failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'update category sucessfully',
		data: category,
	});
});
