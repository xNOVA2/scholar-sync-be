import Joi from "joi";
import { validateRequest } from "./validate.js";
import {  rollNumberAndemailExistsValidator } from "./common.validators.js";
import { ROLES } from "../utils/constants.js";

// user register validator
const userRegisterValidator = Joi.object({
    name: Joi.string().trim().required().min(6),

    email: Joi.string().trim().email({ minDomainSegments: 2 }),
    password: Joi.string()
        .required()
        .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]*$/)
        .message(
            "Password must be at least 6 characters and contain at least one uppercase letter, one digit, and one special character"
        ),
        role: Joi.string()
        .valid(...Object.values(ROLES))
        .required(),
       
        class: Joi.array().items(Joi.string().trim().required()),
        subjects: Joi.array().items(Joi.string().trim().required()),
        school: Joi.string().trim().required(),
        rollNumber: Joi.string().trim().required(),
      });

// user login validator
const userLoginValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }),
    password: Joi.string().required()
});

export const registerValidation = [validateRequest(userRegisterValidator), rollNumberAndemailExistsValidator];
export const loginValidation = validateRequest(userLoginValidator);