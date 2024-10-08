import User from '../models/user.js';
import cloudinary from 'cloudinary';
import path from 'path';
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        Readable.from(buffer).pipe(stream);
    });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await
            User
                .findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ message: "Login successful", token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Ensure the image exists
        if (!req.files || !req.files.image || req.files.image.length === 0) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Upload the image to Cloudinary
        const mainImageResult = await uploadToCloudinary(req.files.image[0].buffer);

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user instance
        user = new User({
            fullname,
            email,
            password,
            image: mainImageResult.secure_url, // Use the URL from Cloudinary
        });

        // Save the user to the database
        await user.save();

        // Optionally, send a success response
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if (!users.length) {
            return res.status(404).json({ error: "No users found" });
        }
        res.json(users);
    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error('Error in getUserById:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let updateData = { name, email };

        if (password) {
            updateData.password = password;  // The model will handle hashing
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error in updateUser:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};