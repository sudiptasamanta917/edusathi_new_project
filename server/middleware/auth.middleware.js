import jwt from "jsonwebtoken";

// Verify the creator token is valid; supports Bearer token and cookie token
export const verifyCreator = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    // Fallback: check cookie
    if (!token && req.cookies) {
        token = req.cookies["token"];
    }

    if (!token) {
        return res.status(401).json({
            message: "No token provided. Please login.",
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Normalize creator info
        req.creator = {
            id: decoded.id || decoded._id || decoded.creatorId || decoded.sub,
            email: decoded.email,
            role: decoded.role || "creator",
        };

        if (!req.creator.id) {
            return res.status(400).json({
                status: false,
                error: "Invalid token payload: missing creator ID",
            });
        }

        next();
    } catch (e) {
        console.error("verifyCreator error:", e);
        if (e.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ error: "Access token expired. Please refresh token." });
        }
        return res.status(401).json({ error: "Invalid access token" });
    }
};
