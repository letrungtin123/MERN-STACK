import User from '../models/user.model.js';

export const updateUserService = async (userId, data) => {
  const newUserUpdate = await User.findByIdAndUpdate({ _id: userId }, data, { new: true });

  return newUserUpdate;
};