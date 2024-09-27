import { Schema, Document, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        maxLength: 64
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    team: [{
        Captain: {
            type: String,
            required: true,
            maxLength: 64
        },
        Player_1: {
            type: String,
            required: true,
            unique: true
        },
        Player_2: {
            type: String,
            required: true,
            unique: true
        },
        Player_3: {
            type: String,
            required: true,
            unique: true
        },
        Player_4: {
            type: String,
            required: true,
            unique: true
        },
    }],
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