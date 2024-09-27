import Admin from '../models/admin.js';

export const createAdmin = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const newAdmin = new Admin({ fullname, email, password });
        await newAdmin.save();

        const adminWithoutPassword = newAdmin.toObject();
        delete adminWithoutPassword.password;

        res.status(201).json({
            success: true,
            message: "Admin successfully added",
            admin: adminWithoutPassword,
        });
    } catch (error) {
        console.error('Error in createAdmin:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};