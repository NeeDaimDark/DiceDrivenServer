import express from 'express';
import { register, deleteOnce, getAll, login, updateUserbyUserId, updateUserbyuserId, checkUserExists,getUserById } from '../controllers/user.js';
import villageRoutes from './village.js';
import multerConfig from '../middlewares/multer-config.js'; // Import your multer configuration

const router = express.Router();

router.get('/checkexists', checkUserExists);  // Add this line to include the user existence check route

router.route('/register').post(multerConfig, register);
router.route('/login').post(login);
router.route('/').get(getAll);
router.route('/updateByUserId/:userId').put(multerConfig, updateUserbyUserId); // Add multerConfig middleware for file upload
router.route('/:id').delete(deleteOnce);
router.route('/:id').get(getUserById);

export default router;

