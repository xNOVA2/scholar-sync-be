import { Router } from 'express';
import RootAPI from './root.route.js';
import AuthAPI from './auth.route.js';
import SubjectAPI from './subject.route.js';
import MeetAPI from './meet.route.js';
import UserAPI from './user.route.js';
// import UserAPI from './user.route.js';

export default class API {
    constructor(app) {
        this.app = app;
        this.router = Router();
        this.routeGroups = [];
    }

    loadRouteGroups() {
        this.routeGroups.push(new RootAPI());
        this.routeGroups.push(new AuthAPI());
        this.routeGroups.push(new SubjectAPI());
        this.routeGroups.push(new MeetAPI())
        this.routeGroups.push(new UserAPI());
    }

    setContentType(req, res, next) {
        res.set('Content-Type', 'application/json');
        next();
    }

    registerGroups() {
        this.loadRouteGroups();
        this.routeGroups.forEach((rg) => {
            console.log('Route group: ' + rg.getRouterGroup());
            this.app.use('/api' + rg.getRouterGroup(), this.setContentType, rg.getRouter());
        });
    }
}