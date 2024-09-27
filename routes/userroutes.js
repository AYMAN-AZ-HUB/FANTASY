import express from 'express';
import { login , register , getUsers , getUserById , updateUser , deleteUser } from '../controllers/usercontrollers';
const router = express.Router();

router.get('/getuser',getUsers);
router.get('/getuserbyid/:id', getUserById);
router.post('/login', login);
router.post('/register', register);
router.put('/upuser/:id', updateUser);
router.delete('deluser/:id', deleteUser);

export default router