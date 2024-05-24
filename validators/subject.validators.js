import Joi from "joi";
import { validateRequest } from "./validate.js";

const subjectValidator = Joi.object({
    class: Joi.string().required(),
    subject: Joi.string().required(),
});

export const subjectValidation = validateRequest(subjectValidator);