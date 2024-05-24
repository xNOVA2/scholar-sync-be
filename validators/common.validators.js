import { asyncHandler } from "../utils/helpers.js";
import { findUser } from "../models/index.js";
import { STATUS_CODES } from "../utils/constants.js";
import { Types } from "mongoose";
import Joi from "joi";

// Define a Joi extension for ObjectId validation
export const objectId = Joi.extend((joi) => ({
    type: "objectId",
    base: joi.string(),
    messages: {
        "objectId.base": "{{#label}} must be a valid ObjectId"
    },
    validate(value, helpers) {
        if (!Types.ObjectId.isValid(value)) {
            return { value, errors: helpers.error("objectId.base") };
        }
    }
}));

// Validate email
export const rollNumberAndemailExistsValidator = asyncHandler(async (req, res, next) => {
    const user = await findUser({$or: [{ email: req.body.email },{ rollNumber: req.body.rollNumber }]});

    if (user) return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: "Email or Roll Number already exists!"
    });
    next();
});

// Validate user id
export const userIdParamExistsValidator = asyncHandler(async (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.userId)) return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: "Invalid user id"
    });

    const user = await findUser({ _id: req.params.userId });
    if (user) return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: "Email already exists!"
    });
    next();
});