import Joi from "joi";
import { validateParams, validateRequest } from "./validate.js";

const addOrUpdateUserValidator = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).required(),
});

const userIdPathValidator = Joi.object({
    userId: Joi.string().hex().length(24).required(),
});

const requestOneOnOneValidator = Joi.object({
    teacher: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    subject: Joi.string().required(),

});
export const requestOneOnOneValidation = validateRequest(requestOneOnOneValidator);
export const userUpdateValidation = validateRequest(addOrUpdateUserValidator);
export const deleteUserValidation = validateParams(userIdPathValidator);