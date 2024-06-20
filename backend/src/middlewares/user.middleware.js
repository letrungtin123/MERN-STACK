import { changePasswordValidation } from '../validations/auth.validation.js';

export const validationChangePassword = (req, res, next) => {
  const body = req.body;

  // validate
  const { error } = changePasswordValidation.validate(body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((item) => item.message);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: errors, success: false });
  }

  req.user = body;
  next();
};