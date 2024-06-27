import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		description: {
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

const Category = mongoose.model('Category', categorySchema);

export default Category;
