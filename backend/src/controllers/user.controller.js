import { HTTP_STATUS } from '../common/http-status.common.js';
import { handleHashPassword } from '../utils/hash-password.util.js';

// export const changePasswordController = async (req, res) => {
//   const { oldPassword, newPassword, confirmPassword } = req.user;

//   // hash password
//   const oldPassword1 = await handleHashPassword({ password: oldPassword });
//   const newPassword2 = await handleHashPassword({ password: newPassword });
//   const confirmPassword3 = await handleHashPassword({ password: confirmPassword });
// };
  // promise
  export const changePasswordController = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.user;
  
    try {
      // hash passwords concurrently
      const [oldPasswordHash, newPasswordHash, confirmPasswordHash] = await Promise.all([
        handleHashPassword({ password: oldPassword }),
        handleHashPassword({ password: newPassword }),
        handleHashPassword({ password: confirmPassword })
      ]);
    } catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Internal server error',success:false });
      }
    };