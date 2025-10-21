import jwt from 'jsonwebtoken';

const generateAccessToken = (creator) => {
    const payload = {
        sub: creator._id, // Standard JWT subject claim
        id: creator._id,
        _id: creator._id, // Add both for compatibility
        email: creator.email,
        role: "creator", // Add role for authorization
    };
    
    const SECRET = process.env.JWT_ACCESS_SECRET || 'super_secret_access';
    const EXPIRES = process.env.JWT_ACCESS_EXPIRES || '45m';
    
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export default generateAccessToken;