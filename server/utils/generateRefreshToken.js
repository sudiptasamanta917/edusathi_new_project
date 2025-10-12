import jwt from 'jsonwebtoken';

const generateRefreshToken = (creator) => {
    const refreshToken = jwt.sign(
        { 
            id: creator._id,
            _id: creator._id,
            email: creator.email
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
    return refreshToken;
}
export default generateRefreshToken;