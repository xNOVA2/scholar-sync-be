import mongoose, { Schema } from 'mongoose';

const subjectSchema = new Schema({
    subject: { type: String},
    class :{type:Number},
    picture:{type:String},
    teachesBy:{type:Schema.Types.ObjectId, ref:'user'}
}, { timestamps: true, versionKey: false}

    
);

const SubjectModel = mongoose.model('subject', subjectSchema);

export const createSubject = (obj) => SubjectModel.create(obj);
export const fetchSubjects = (query) => SubjectModel.find(query);
