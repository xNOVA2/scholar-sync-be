import { Router } from 'express';
import { ROLES } from '../utils/constants.js';
import { authMiddleware } from '../middlewares/index.js';
import {  acceptSession, fetchAllUsers, fetchOnlineClasses, notification, rejectSession, requestSessionOneOnOne, sessionRequests, teachers } from '../controllers/index.js';
import { requestOneOnOneValidation } from '../validators/user.validators.js';

export default class UserAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }
    setupRoutes() {
        const router = this.router;
        router.get('/', fetchAllUsers);
        router.get('/notification',authMiddleware(Object.values(ROLES)),notification);
        router.get('/teacher-request',authMiddleware(Object.values(ROLES)),sessionRequests); // Teacher will see student request on there screen
        router.post('/request-session', authMiddleware(Object.values(ROLES)),requestOneOnOneValidation,requestSessionOneOnOne);
        router.put('/accept-session', authMiddleware(ROLES.TEACHER),acceptSession);
        router.put('/reject-session', authMiddleware(ROLES.TEACHER),rejectSession);
        router.get('/find/teachers',authMiddleware(Object.values(ROLES)),teachers);
        router.get('/one-on-one/session',authMiddleware(Object.values(ROLES)),fetchOnlineClasses);
    }
    getRouter() {
        return this.router;
    }
    getRouterGroup() {
        return '/user';
    }
}