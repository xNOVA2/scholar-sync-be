import jwt from 'jsonwebtoken';
import { createUser, findUser } from '../models/index.js';
import { ROLES } from './constants.js';
import { hash } from 'bcrypt';

// generate response with status code
export const generateResponse = (data, message, res, code = 200) => {
    return res.status(code).json({
        statusCode: code,
        message,
        data,
    });
}

// parse body to object or json (if body is string)
export const parseBody = (body) => {
    let obj;
    if (typeof body === "object") obj = body;
    else obj = JSON.parse(body);
    return obj;
}

// pagination with mongoose paginate library
export const getMongoosePaginatedData = async ({
    model, page = 1, limit = 10, query = {}, populate = '', select = '-password', sort = { createdAt: -1 },
}) => {
    const options = {
        select,
        sort,
        populate,
        lean: true,
        page,
        limit,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'data',
            limit: 'perPage',
            page: 'currentPage',
            meta: 'pagination',
        },
    };

    const { data, pagination } = await model.paginate(query, options);
    delete pagination?.pagingCounter;

    return { data, pagination };
}

// aggregate pagination with mongoose paginate library
export const getMongooseAggregatePaginatedData = async ({ model, page = 1, limit = 10, query = [] }) => {
    const options = {
        page,
        limit,
        customLabels: {
            totalDocs: 'totalItems',
            docs: 'data',
            limit: 'perPage',
            page: 'currentPage',
            meta: 'pagination',
        },
    };

    const myAggregate = model.aggregate(query);
    const { data, pagination } = await model.aggregatePaginate(myAggregate, options);

    delete pagination?.pagingCounter;

    return { data, pagination };
}

export const asyncHandler = (requestHandler) => {
    return (req, res, next) => Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
};

// create default admin
export const createDefaultAdmin = async () => {
    const userExist = await findUser({ email: process.env.ADMIN_DEFAULT_EMAIL, role: ROLES.ADMIN });
    if (userExist) {
        console.log('admin exists -> ', userExist.email);
        return
    };

    console.log('admin not exist');
    // const password = await hash(process.env.ADMIN_DEFAULT_PASSWORD, 10);

    // create default admin
    await createUser({
        email: process.env.ADMIN_DEFAULT_EMAIL,
        password: process.env.ADMIN_DEFAULT_PASSWORD,
        name: 'Admin',
        role: ROLES.ADMIN
    });

    console.log('Admin default created successfully');
};
export const generateRandomOTP = () => {
    return Math.floor(10000 + Math.random() * 90000);
}