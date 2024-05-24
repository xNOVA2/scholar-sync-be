import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongoosePaginatedData } from "../utils/helpers.js";
import { ROLES } from "../utils/constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user schema
const userSchema = new Schema({
    name: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String },
    school: { type: String },
    profileImage: { type: String },
    status: { type: String, enum: ["online", "busy",'offline'], default: "online" },
    rollNumber: { type: String },
    class: [{type:Number}],
    subjects: [{ type: Schema.Types.ObjectId, ref: "subject" }],
    role: { type: String, enum: Object.values(ROLES), default: "student" },
    refeshToken: { type: String, select: false },
    fcmToken: { type: String,  select: false },
    otp:{type:Number,select:false},
    otpExpiry:{type:Date,select:false},
    
}, { timestamps: true, versionKey: false });

// hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
            name:this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};


userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model('user', userSchema);

// create new user
export const createUser = (obj) => UserModel.create(obj);

// find user by query
export const findUser = (query) => UserModel.findOne({...query});

// get all users
export const getAllUsers = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: UserModel,
        query:   {...query},
        page,
        limit,
    });

    return { data, pagination };
};

