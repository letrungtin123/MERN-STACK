import Brand from '../models/brand.model.js';
import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleAsync } from '../utils/trycatch.js';

// tạo brand
export const createBrand = handleAsync(async (req, res) => {
	const body = req.body;
	const brand = await Brand.create(body);

	if (!brand) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'create brand failed' });
	}

	return res.status(HTTP_STATUS.CREATED).json({
		message: 'create brand successfully',
		data: brand,
	});
});

// lấy ra danh sách brand
export const getBrand = handleAsync(async (req, res) => {
	const brand = await Brand.find();

	if (!brand) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'get brand failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'get brand sucessfully',
		data: brand,
	});
});

// lấy ra danh sách brand theo id
export const getBrandById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const brand = await Brand.findById(id);

	if (!brand) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'get brand failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'get brand sucessfully',
		data: brand,
	});
});

// xóa brand
export const deleteBrand = handleAsync(async (req, res) => {
	const { id } = req.params;
	const brand = await Brand.findByIdAndDelete(id);

	if (!brand) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'delete brand failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'delete brand sucessfully',
		data: brand,
	});
});

// cập nhật brand
export const updateBrandById = handleAsync(async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	const brand = await Brand.findByIdAndUpdate(id, body, { new: true });

	if (!brand) {
		return res
			.status(HTTP_STATUS.BAD_REQUEST)
			.json({ message: 'update brand failed' });
	}

	return res.status(HTTP_STATUS.OK).json({
		message: 'update brand sucessfully',
		data: brand,
	});
});
