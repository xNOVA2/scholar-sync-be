import { Router } from 'express';
import { defaultHandler } from '../controllers/index.js';
import { createSubjects, getSubjects } from '../controllers/subject.controller.js';
import { upload } from '../utils/multer.js';
import { subjectValidation } from '../validators/subject.validators.js';

export default class SubjectAPI {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/',upload("subjects").fields([{name:'picture',maxCount:'1'}]),subjectValidation ,createSubjects);
        this.router.get('/',getSubjects)
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/subject';
    }
}
