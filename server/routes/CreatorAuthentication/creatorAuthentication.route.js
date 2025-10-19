import { Router } from 'express';
import bcrypt from 'bcrypt'

import Creator from '../../models/creator.model.js';
import generateAccessToken from '../../utils/generateAccessToken.js';
import generateRefreshToken from '../../utils/generateRefreshToken.js';
import { cookieOptions} from "../../utils/cookieOptions.js";
import { verifyCreator } from "../../middleware/auth.middleware.js";
import { sendOTP } from "../../utils/sendOTP.js";
import { generateOTP } from "../../utils/generateOTP.js";
import jwt from "jsonwebtoken";

const router = Router();

// Creator Registration Route
router.post('/register', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            profilePicture,
            bio,
            specialization,
            qualifications,
            experience,
            bankDetails,
            totalEarnings,
            averageRating,
            isActive
        } = req.body;

        // Validate phone if provided (coerce to string). If your app requires phone number,
        // change this to a required validation.
        if (phoneNumber && String(phoneNumber).length !== 10) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' });
        }

        // Check existing creator
        const existingCreator = await Creator.findOne({ email });
        if (existingCreator) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const generatedOTP = generateOTP(); // e.g., 6-digit random number

        // Create new creator
        const newCreator = new Creator({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            profilePicture,
            bio,
            specialization,
            qualifications,
            experience,
            bankDetails,
            totalEarnings,
            averageRating,
            isVerified: false,
            otp: generatedOTP,
            otpExpires: Date.now() + 60 * 1000, // 1 minutes validity
            isActive
        });

    await newCreator.save();

        // Send OTP via email
        await sendOTP(
            email,
            generatedOTP,
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please check your email for OTP.',
            creatorId: newCreator._id
        });
    } catch (error) {
        console.error("Register error:", error);
        // Temporary: send error details for debugging. Remove or sanitize in production.
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Creator Login Route
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    // Validate email and password
    if (!email || !password) return res.status(400).json({
        message: 'Please provide email and password'
    })

    // Find an existing creator
    const creator = await Creator.findOne({email});
    if (!creator){
        return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check is password match with db password
    const isPasswordMatch = await bcrypt.compare(password, creator.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token and send to cookie
    const accessToken = generateAccessToken(creator);
    const refreshToken = generateRefreshToken(creator);

    res.cookie("token", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        access_token: accessToken, // Frontend expects access_token
        refresh_token: refreshToken, // Frontend expects refresh_token
        accessToken: accessToken, // Keep both for compatibility
        refreshToken: refreshToken,
        creator: {
            _id: creator._id,
            firstName: creator.firstName,
            lastName: creator.lastName,
            email: creator.email,
        }
    })
})

// Creator Logout Route
router.get('/logout', async (req, res) => {
    const token = req.cookies.token || "";

    // verify token
    if (!token) return res.status(401).json({
        message: "You are not logged in! Please login to continue"
    })

    // Clear token from cookie if available
    res.clearCookie("token", cookieOptions)
    // Also clear refresh token cookie if present
    res.clearCookie("refreshToken", {
        ...cookieOptions,
        maxAge: 0
    })

    res.status(200).json({
        message: 'Logout successful'
    })
})

// Creator Profile Route
router.get('/profile', verifyCreator, async (req, res) => {
    res.send('api is running')
})

// Creator Update Profile Route
router.put('/update', async (req, res) => {
    res.send('api is running')
})

// Creator Upload Document Route
router.post('/upload-document', async (req, res) => {
    res.send('api is running')
})

// Creator OTP Verification Route
router.post('/verify-otp', async (req, res) => {
    try {
        const { creatorId, otp } = req.body;

        const creator = await Creator.findById(creatorId);
        if (!creator) return res.status(400).json({ message: "User not found" });

        if (creator.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (creator.otp !== otp || Date.now() > creator.otpExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        creator.isVerified = true;
        creator.otp = undefined;
        creator.otpExpires = undefined;
        await creator.save();

        res.json({
            success: true,
            message: "Account verified successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Creator Refresh Token Route
router.post('/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(404).json({ message: "No refresh token found" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET,  (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Invalid refresh token' })
            const newAccessToken = generateAccessToken(decoded);

            res.cookie("token", newAccessToken, cookieOptions);
            return res.status(200).json({
                success: true,
                message: 'New Access Token Generated Successfully',
            })
        })
    } catch (e) {
        console.error("Refresh token error:", e);
        res.status(500).json({ message: "Internal server error" });
    }
})
export default router;
