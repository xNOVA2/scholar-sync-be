import { findUser, getAllUsers } from "../models/index.js";
import { createSessionRequest, fetchOneSessionRequest, fetchSessionRequest } from "../models/request.model.js";
import { createMeetSession, findMeetSession } from "../models/session.model.js";
import { STATUS_CODES } from "../utils/constants.js";

import { asyncHandler, generateResponse } from '../utils/helpers.js';
import { createSession } from "./meet.controller.js";

// get all users
export const fetchAllUsers = asyncHandler(async (req, res, next) => {

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 10);
    
    // const filters = [{ role: { $ne: ROLES.ADMIN } }];
    // if (req.query.role) filters.push({ role: req.query.role });
    // const query = { $and: filters };

    const usersData = await getAllUsers({  page, limit });
   
    generateResponse(usersData, 'List fetched successfully', res);
});

// get current user
export const getUser = asyncHandler(async (req, res, next) => {
    const user = await findUser({ _id: req.params.userId });
    generateResponse(user, 'User fetched successfully', res);
});



export const requestSessionOneOnOne = asyncHandler(async (req, res, next) => {
    const teacher = await findUser({ _id: req.body.teacher });
    
    if(teacher.status !== 'online') return next({
        message: 'Teacher is not active',
        statusCode: 400,
    });

    req.body.student = req.user.id;
    
    const createRequest = await createSessionRequest(req.body)

    generateResponse(createRequest, 'Session requested successfully', res);
})

export const notification = asyncHandler(async (req, res, next) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const student = req.query.student || false;
    const teacher = req.query.teacher || false;

    const query = {};

    if(student) {
        query.student = req.user.id;
    }

    if(teacher) {
        query.teacher = req.user.id;
    }

    const response = await fetchSessionRequest({limit,page,query});
    generateResponse(response, 'Notification fetched successfully', res);
})


// Reject Session
export const rejectSession = asyncHandler(async (req, res, next) => {

    const findSession = await fetchOneSessionRequest({_id:req.body.sessionId});

    if(!findSession) return next({
        message: 'Session not found',
        statusCode: 400,
    });

    findSession.status = 'rejected';
    findSession.isDeleted = true;
    await findSession.save();
    generateResponse(findSession, 'Session rejected successfully', res);
})

// Accept Session
export const acceptSession = asyncHandler(async (req, res, next) => {
    
        const findSession = await fetchOneSessionRequest({_id:req.body.sessionId});

        if(!findSession) return next({
            message: 'Session not found',
            statusCode: 400,
        });

        findSession.status = 'accepted';
        await findSession.save();            

     

        const teacher = req.user.id;
        const startTime = findSession.startTime;
        const endTime = findSession.endTime;
        const oneOnOne = true;
        const student = findSession.student;
        const meetUri = await createSession(req,res,next);

        const createSessionMeet = await createMeetSession({
            teacher,
            startTime,
            endTime,
            oneOnOne,
            student,
            meetUri
        })
        console.log(createSessionMeet);
        generateResponse(findSession, 'Session accepted successfully', res);
    })

    // Teacher Requests
    export const sessionRequests = asyncHandler(async (req, res, next) => {
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 10);
        const query = { status: 'pending', teacher: req.user.id };
        const response = await fetchSessionRequest({page,limit,query});
        generateResponse(response, 'Session requests fetched successfully', res);
    })

    export const teachers = asyncHandler(async (req, res, next) => {
        const teacherClass = req.query.class;
        const subject = req.query.subject;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        if (!teacherClass) {
            return next({
                message: 'Class is required',
                statusCode: STATUS_CODES.BAD_REQUEST,
            });
        }
    
        // Ensure teacherClass and subject are arrays if they are expected to be arrays in the user model
        const classQuery = Array.isArray(teacherClass) ? { $in: teacherClass } : { $in: [teacherClass] };
        const subjectQuery = Array.isArray(subject) ? { $in: subject } : { $in: [subject] };
    
        const query = { role: 'teacher', class: classQuery, subjects: subjectQuery };
    
            const users = await getAllUsers({ page, limit, query });
            generateResponse(users, 'Teachers fetched successfully', res);
      
    });

    export const fetchOnlineClasses = asyncHandler(async (req, res, next) => {

        const teacher = req.query.teacher || false;
        const student =req.query.student || false;

        let query = {}

        if(student){
            query={student:req.user.id}
        }
        
        if(teacher){
            query = {teacher:req.user.id}
        }

        query = {...query,oneOnOne:true}
        const data = await findMeetSession(query).sort({createdAt:-1});
        generateResponse(data, 'Online classes fetched successfully', res);
    });


export const updateUser = asyncHandler(async (req, res, next) => {
    
    const user = await updateUser(req.body);
    
    generateResponse(user, 'User updated successfully', res);
});