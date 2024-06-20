import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleVerifyToken } from '../utils/jwt.util.js';

export const verifyToken = async (req, res, next) => {
  const beaerToken = req.headers['authorization'];

  if (!beaerToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Access denied!', success: false });
  }

  const token = beaerToken.split(' ')[1];

  // verify token
  const verifyToken = await handleVerifyToken({ token, secretKey: process.env.SEND_EMAIL_SECRET_KEY });
  if (!verifyToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid token!', success: false });
  }

  req.user = verifyToken;

  next();
};