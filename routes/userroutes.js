import express from 'express';
import { login , getUsers , register , getUserById , updateUser , deleteUser } from '../controllers/usercontrollers.js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});

const uploadFields = [
    { name: 'image', maxCount: 10 },
];

router.get('/getuser',getUsers);
router.get('/getuserbyid/:id', getUserById);
router.post('/login', login);
router.post('/register', upload.fields(uploadFields), register);
router.put('/upuser/:id', upload.fields(uploadFields), updateUser);
router.delete('deluser/:id', deleteUser);

export default router