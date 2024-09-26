import { Schema, Document, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        max: 64
    },
    image: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    role: {
        type: String,
        default: 'user',
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const hashedPassword = await bcryptjs.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const User = model('User', userSchema);

export default User;