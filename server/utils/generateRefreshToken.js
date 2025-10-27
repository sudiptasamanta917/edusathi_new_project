import jwt from 'jsonwebtoken';

const generateRefreshToken = (creator) => {
    const payload = { 
        sub: creator._id, // Standard JWT subject claim
        id: creator._id,
        _id: creator._id,
        email: creator.email,
        role: "creator" // Add role for authorization
    };
    
    const SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh';
    const EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';
    
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}
export default generateRefreshToken;