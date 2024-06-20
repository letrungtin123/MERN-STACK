import User from "../models/user.model.js";

//check email da ton tai
export const checkEmailExist  = async (email) =>{
    const user = await User.findOne({email});
    return user;
};
//tao user
export const createUser = async (data)=> {
    const user = await User.create(Data);
    return user;
}
//update password 
export const updatePassword = async (userId,newPassword) => {
    const newUserUpdate = await User.findByIdAndUpdate({_id:userId},{password: newPassword}, {new:true});
        return Boolean(newUserUpdate);
}