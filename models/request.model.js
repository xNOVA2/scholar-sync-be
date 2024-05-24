import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongoosePaginatedData } from '../utils/helpers.js';

const sessionRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    isDeleted:{
        type: Boolean,
        default: false
    },
},{timestamps: true, versionKey: false});

sessionRequestSchema.plugin(mongoosePaginate);
sessionRequestSchema.plugin(aggregatePaginate);

const SessionRequest = mongoose.model('SessionRequest', sessionRequestSchema);

export const createSessionRequest = (obj) => SessionRequest.create(obj);
export const fetchOneSessionRequest = (query) => SessionRequest.findOne(query);

export const fetchSessionRequest  = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: SessionRequest,
        query:   {...query},
        page,
        limit,
    });

    return { data, pagination };
};