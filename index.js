import express from 'express';
const app = express();

app.use(express.json());

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