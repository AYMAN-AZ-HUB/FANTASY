import './config/database.js';
import express from 'express';
import dotenv from 'dotenv';
import adminroutes from "./routes/adminroutes.js";
import userroutes from "./routes/userroutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", adminroutes);
app.use("/api", userroutes);

const PORT = process.env.PORT || 5000;

app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        error: 'Route not found',
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});