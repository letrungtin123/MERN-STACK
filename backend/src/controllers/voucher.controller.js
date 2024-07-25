import { HTTP_STATUS } from '../common/http-status.common.js';
import { voucherService } from '../services/voucher.service.js';

export const voucherController = {
  // create voucher
  createVoucher: async (req, res) => {
    const voucher = await voucherService.createVoucher(req.body);

    if (!voucher) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create voucher faild!', status: false });
    }

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create voucher successfully!',
      status: true,
      data: voucher,
    });
  },
};
