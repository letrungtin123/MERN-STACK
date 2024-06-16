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
