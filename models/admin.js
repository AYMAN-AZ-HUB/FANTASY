import { Schema, Document, model } from "mongoose";
import bcryptjs from "bcryptjs";

const adminSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        max: 64
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
        default: 'admin',
    }
});

adminSchema.pre('save', async function (next) {
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

const Admin = model('Admin', adminSchema);

export default Admin;