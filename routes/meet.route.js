import { Router } from 'express';
import { createSession } from '../controllers/meet.controller.js';

export default class MeetAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/', createSession);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/meet';
    }
}
