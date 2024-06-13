import mongoose from 'mongoose';

const meetSessionSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    class: {
        type:Number
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDelated:{
        type:Boolean,
        default:false
    },
    oneOnOne:{
        type:Boolean,
        default:false
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    meetUri:{
        type:String
    }
});
// https://www.googleapis.com/auth/meetings.space.created
const MeetSession = mongoose.model('MeetSession', meetSessionSchema);

export const createMeetSession = (obj) => MeetSession.create(obj)
export const findMeetSession = (obj) => MeetSession.find(obj);
export const findOneMeetSession = (obj) => MeetSession.findOne(obj);
export const updateMeetSession = (query, update) => MeetSession.updateOne(query,update);
