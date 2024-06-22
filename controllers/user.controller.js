import { findUser, getAllUsers, updateUser } from "../models/index.js";
import {
  createSessionRequest,
  fetchOneSessionRequest,
  fetchSessionRequest,
} from "../models/request.model.js";
import { createMeetSession, findMeetSession } from "../models/session.model.js";
import { STATUS_CODES } from "../utils/constants.js";

import { asyncHandler, generateResponse } from "../utils/helpers.js";
import { createSession } from "./meet.controller.js";

// get all users
export const fetchAllUsers = asyncHandler(async (req, res, next) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);

  const usersData = await getAllUsers({ page, limit });

  generateResponse(usersData, "List fetched successfully", res);
});

// get current user
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await findUser({ _id: req.params.userId }).lean()
  generateResponse(user, "User fetched successfully", res);
});

export const requestSessionOneOnOne = asyncHandler(async (req, res, next) => {
  const teacher = await findUser({ _id: req.body.teacher });

  if (teacher.status !== "online")
    return next({
      message: "Teacher is not active",
      statusCode: 400,
    });

  req.body.student = req.user.id;

  const createRequest = await createSessionRequest(req.body);

  generateResponse(createRequest, "Session requested successfully", res);
});

export const notification = asyncHandler(async (req, res, next) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const student = req.query.student || false;
  const teacher = req.query.teacher || false;

  const query = {};

  if (student) {
    query.student = req.user.id;
  }

  if (teacher) {
    query.teacher = req.user.id;
  }

  const response = await fetchSessionRequest({ limit, page, query,populate:["teacher","student"] });
  generateResponse(response, "Notification fetched successfully", res);
});

// Reject Session
export const rejectSession = asyncHandler(async (req, res, next) => {
  const findSession = await fetchOneSessionRequest({ _id: req.body.sessionId });

  if (!findSession)
    return next({
      message: "Session not found",
      statusCode: 400,
    });

  findSession.status = "rejected";
  findSession.isDeleted = true;
  await findSession.save();
  generateResponse(findSession, "Session rejected successfully", res);
});

// Accept Session
export const acceptSession = asyncHandler(async (req, res, next) => {
  const findSession = await fetchOneSessionRequest({ _id: req.body.sessionId });

  if (!findSession)
    return next({
      message: "Session not found",
      statusCode: 400,
    });

  findSession.status = "accepted";
  await findSession.save();

  const teacher = req.user.id;
  const startTime = findSession.startTime;
  const endTime = findSession.endTime;
  const oneOnOne = true;
  const student = findSession.student;
  const meetUri = await createSession(req, res, next);
  const subject = findSession.subject;

  const createSessionMeet = await createMeetSession({
    teacher,
    startTime,
    endTime,
    oneOnOne,
    student,
    meetUri,
    subject,
  });

  generateResponse(createSessionMeet, "Session accepted successfully", res);
});
export const sessionRequests = asyncHandler(async (req, res, next) => {
  const page = +(req.query.page || 1);
  const limit = +(req.query.limit || 10);
  const query = { status: "pending", teacher: req.user.id };
  const response = await fetchSessionRequest({
    page,
    limit,
    query,
    populate: "student",
  });

  generateResponse(response, "Session requests fetched successfully", res);
});

export const teachers = asyncHandler(async (req, res, next) => {
  const teacherClass = req.query.class;
  const subject = req.query.subject;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!teacherClass) {
    return next({
      message: "Class is required",
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
  // Ensure teacherClass and subject are arrays if they are expected to be arrays in the user model
  const classQuery = Array.isArray(teacherClass)
    ? { $in: teacherClass }
    : { $in: [teacherClass] };
  const subjectQuery = Array.isArray(subject)
    ? { $in: subject }
    : { $in: [subject] };

  const query = { role: "teacher", class: classQuery, subjects: subjectQuery };
  const users = await getAllUsers({ page, limit, query });
  generateResponse(users, "Teachers fetched successfully", res);
});

export const fetchOnlineClasses = asyncHandler(async (req, res, next) => {
  const teacher = req.query.teacher || false;
  const student = req.query.student || false;
  const oneOnOne = req.query.oneOnOne || true;
  let query = {};

  if (student) {
    query = { student: req.user.id };
  }
  if (teacher) {
    query = { teacher: req.user.id };
  }
  query = { ...query, oneOnOne };
  const data = await findMeetSession(query)
    .sort({ createdAt: -1 })
    .populate("subject");
  generateResponse(data, "Online classes fetched successfully", res);
});

export const findUsersClasses = asyncHandler(async (req, res, next) => {
  const user = await findUser({ _id: req.user.id });

  let query = {};
  query = { class: user.class[0] };
  const data = await findMeetSession(query)
    .sort({ createdAt: -1 })
    .populate("subject");
  generateResponse(data, "Online classes fetched successfully", res);
});

export const updateUsers = asyncHandler(async (req, res, next) => {
  const user = await updateUser(req.body);
  generateResponse(user, "User updated successfully", res);
});

export const liveClass = asyncHandler(async (req, res, next) => {
  req.body.startDate = new Date();
  req.body.endDate = new Date(
    new Date().setMinutes(new Date().getMinutes() + 30)
  );
  req.body.teacher = req.user.id;
  req.body.oneOnOne = false;
  const findTeacher = await findUser({ _id: req.user.id });
  req.body.subject = findTeacher.subjects[0];
  req.body.meetUri = await createSession(req, res, next);
  const session = await createMeetSession(req.body);
  generateResponse(session, "User fetched successfully", res);
});

export const scheduleClass = asyncHandler(async (req, res, next) => {
  req.body.teacher = req.user.id;
  req.body.oneOnOne = false;
  const findTeacher = await findUser({ _id: req.user.id });
  req.body.subject = findTeacher.subjects[0];
  req.body.meetUri = await createSession(req, res, next);
  const session = await createMeetSession(req.body);
  generateResponse(session, "session created successfully", res);
});
