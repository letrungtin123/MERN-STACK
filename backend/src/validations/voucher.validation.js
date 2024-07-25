const Joi = require('joi');
const dayjs = require('dayjs');

// Định nghĩa regex cho trường code
const codeRegex = /^COL\d{10}$/;

const validateDateRange = (value, helpers) => {
  const { startDate, endDate } = value;

  if (startDate && endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    if (!start.isValid() || !end.isValid()) {
      return helpers.message('Ngày không hợp lệ');
    }
    if (start.isAfter(end)) {
      return helpers.message('Ngày bắt đầu phải trước ngày kết thúc');
    }
  }
  return value;
};

export const createVoucherValidation = Joi.object({
  fullname: Joi.string().required().messages({
    'string.base': 'Họ và tên phải là chuỗi',
    'string.empty': 'Họ và tên là bắt buộc',
    'any.required': 'Họ và tên là bắt buộc',
  }),
  phone: Joi.string().required().messages({
    'string.base': 'Số điện thoại phải là chuỗi',
    'string.empty': 'Số điện thoại là bắt buộc',
    'any.required': 'Số điện thoại là bắt buộc',
  }),
  address: Joi.string().required().messages({
    'string.base': 'Địa chỉ phải là chuỗi',
    'string.empty': 'Địa chỉ là bắt buộc',
    'any.required': 'Địa chỉ là bắt buộc',
  }),
  avatar: Joi.string().required().messages({
    'string.base': 'Avatar phải là chuỗi',
    'string.empty': 'Avatar là bắt buộc',
    'any.required': 'Avatar là bắt buộc',
  }),
  code: Joi.string()
    .pattern(codeRegex)
    .required()
    .messages({
      'string.pattern.base': 'Mã phải theo định dạng CODE và theo sau là 6 chữ số',
      'string.empty': 'Mã là bắt buộc',
      'any.required': 'Mã là bắt buộc',
    }),
  startDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Ngày bắt đầu phải là ngày hợp lệ',
    }),
  endDate: Joi.date()
    .optional()
    .messages({
      'date.base': 'Ngày kết thúc phải là ngày hợp lệ',
    }),
}).custom(validateDateRange, { 
  messages: { 
    'custom.dateRange': 'Khoảng thời gian không hợp lệ' 
  } });

