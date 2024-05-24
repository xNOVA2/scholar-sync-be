import { STATUS_CODES } from "../utils/constants.js";

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next({
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: error.details[0].message.replace(/"/g, ''),
            });
        }
        next();
    };
}

export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params, { abortEarly: false });
        if (error) {
            return next({
                statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
                message: error.details[0].message.replace(/"/g, ''),
            });
        }
        next();
    };
}