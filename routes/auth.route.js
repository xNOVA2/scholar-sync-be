import { Router } from 'express';
import { login, otpGenerate, otpVerify, register,resetPassword,logout,getCurrentUser } from '../controllers/index.js';
import { loginValidation, registerValidation } from '../validators/index.js';
import { upload } from '../utils/multer.js';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export default class AuthAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/register',upload("users").fields([{name:'profileImage',maxCount:'1'}]), registerValidation, register);
        this.router.post('/login', loginValidation, login);
        this.router.post('/forget',  otpGenerate);
        this.router.put('/verify-otp',  otpVerify);
        this.router.put('/reset-password',authMiddleware(Object.values(ROLES)),  resetPassword);
        this.router.post('/logout',authMiddleware(Object.values(ROLES)),logout)
        this.router.get('/user',authMiddleware(Object.values(ROLES)),getCurrentUser)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/auth';
    }
}