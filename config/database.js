import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DB_URL;

mongoose.connect(`${DB}`)
    .then(() => {
        console.log(`Database connected successfully`);
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });