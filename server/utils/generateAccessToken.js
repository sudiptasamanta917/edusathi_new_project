import jwt from 'jsonwebtoken';

const generateAccessToken = (creator) => {
    const accessToken = jwt.sign(
        {
            id: creator._id,
            _id: creator._id, // Add both for compatibility
            email: creator.email,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "1h" }
    );
    return accessToken;
}

export default generateAccessToken;