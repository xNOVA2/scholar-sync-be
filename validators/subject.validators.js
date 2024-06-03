import Joi from "joi";
import { validateRequest } from "./validate.js";

const subjectValidator = Joi.object({
    class: Joi.array().items(Joi.number()).required(),
    subject: Joi.string().required(),
});

export const subjectValidation = validateRequest(subjectValidator);