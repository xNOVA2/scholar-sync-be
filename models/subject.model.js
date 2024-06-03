import { query } from 'express';
import mongoose, { Schema } from 'mongoose';
import { getMongooseAggregatePaginatedData } from '../utils/helpers.js';
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const subjectSchema = new Schema({
    subject: {type: String,enum:['Maths','English','Science','History','Geography','Islamiyat','Urdu','Social Studies']},
    class :[Number],
    picture:{type:String},
}, { timestamps: true, versionKey: false}

    
);

subjectSchema.plugin(mongoosePaginate);
subjectSchema.plugin(aggregatePaginate);

const SubjectModel = mongoose.model('subject', subjectSchema);

export const createSubject = (obj) => SubjectModel.create(obj);
export const fetchSubject = (query) => SubjectModel.findOne(query);

export const fetchSubjects = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongooseAggregatePaginatedData({
        model: SubjectModel,
        query:   [query],
        page,
        limit,
    });

    return { data, pagination };
};
