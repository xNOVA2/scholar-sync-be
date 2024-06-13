import { Router } from 'express';
import { defaultHandler, liveClass, scheduleClass } from '../controllers/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ROLES } from '../utils/constants.js';

export default class TeacherAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/class-live',authMiddleware(Object.values(ROLES)),liveClass);
        this.router.post('/class',authMiddleware(Object.values(ROLES)), scheduleClass);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/teacher';
    }
}
