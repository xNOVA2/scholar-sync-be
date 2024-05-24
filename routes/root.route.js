import { Router } from 'express';
import { defaultHandler } from '../controllers/index.js';

export default class RootAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', defaultHandler);
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/';
    }
}
