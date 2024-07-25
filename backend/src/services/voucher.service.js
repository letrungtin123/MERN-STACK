import Voucher from '../models/voucher.model.js';

export const voucherService = {
  // create
  createVoucher: async (body) => {
    return await Voucher.create(body);
  },
};
