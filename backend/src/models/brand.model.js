import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		country: {
			type: String,
		},
		image: {
			type: String,
		},
		productIds: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
