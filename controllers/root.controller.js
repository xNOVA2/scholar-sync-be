import { generateResponse, asyncHandler } from '../utils/helpers.js';

const defaultHandler = asyncHandler(async (req, res, next) => {
    generateResponse(null, `Health check passed`, res);
});

export { defaultHandler }