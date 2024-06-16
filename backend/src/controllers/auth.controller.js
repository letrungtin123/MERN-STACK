import { checkEmailExist, createUser } from '../services/auth.service.js';
import { handleComparePassword, handleHashPassword } from '../utils/hash-password.util.js';

import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleGenenateToken } from '../utils/jwt.util.js';

export const registerController = async (req, res) => {
  const body = req.user;

  // check email
  const user = await checkEmailExist(body.email);
  if (user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Email already exist', success: false });
  }

  // hash password
  const hashPassword = await handleHashPassword({ password: body.password, saltNumber: 5 });

  // create
   user in db
  const newUser = await createUser({ ...body, password: hashPassword });

  if (!newUser) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'User not created', success: false });
  }

  // generate token
  const accessToken = await handleGenenateToken({ payload: { _id: newUser._id, email: newUser.email } });

  return res.status(HTTP_STATUS.CREATED).json({
    message: 'User created successfully',
    success: true,
    accessToken,
  });
};

export const loginController = async (req, res) => {
  const body = req.user;

  // check email
  const user = await checkEmailExist(body.email);
  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Email not found!', success: false });
  }

  // compare password
  const isMatch = await handleComparePassword({ password: body.password, hashPassword: user.password });
  if (!isMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Password not match!', success: false });
  }

  // generate token
  const accessToken = await handleGenenateToken({ payload: { _id: user._id, email: user.email } });

  return res.status(HTTP_STATUS.OK).json({
    message: 'Login successfully',
    success: true,
    accessToken,
  });
};

// send email
export const sendEmailController = async (req, res) => {
  const { email } = req.email;

  // check email
  const user = await checkEmailExist(email);
  if (user) {
    // generate token
    const accessToken = await handleGenenateToken({ payload: { email: user.email } });

    // link reset password
    const link = `http://localhost:8080/reset-password?token=${accessToken}`;
    // send email

    return res.status(HTTP_STATUS.OK).json({
      message: 'Email sent successfully',
      success: true,
      link,
    });
  }
};