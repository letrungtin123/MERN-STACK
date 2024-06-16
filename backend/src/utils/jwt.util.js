import * as dotenv from "dotenv";

import jwt from 'jsonwebtoken';

dotenv.config();
export const handleGenenateToken = async ({payload,secretKey = process.env.SECRET_KEY,expiresIn = '1h'})=>{
    const token = jwt.sign(payload,secretKey, {expiresIn});
    return token
}