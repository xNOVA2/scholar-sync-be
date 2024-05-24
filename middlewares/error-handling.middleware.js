import { Error as MongooseError } from "mongoose";

export function notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode ? err.statusCode : err instanceof MongooseError ? 400 : 500;
    const error = new Error(err?.message.replace(/\"/g, '') || 'Internal Server Error');

    return res.status(statusCode).json({
        message: error?.message,
        statusCode: statusCode,
        stack: error?.stack,
    });
}


