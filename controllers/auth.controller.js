import { generateResponse, asyncHandler, generateRandomOTP } from '../utils/helpers.js';
import { createUser, findUser } from '../models/index.js';
import { STATUS_CODES } from '../utils/constants.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
// register user

export const register = asyncHandler(async (req, res, next) => {
const {email} = req.body
    const isUserExist = await findUser({email})
    if(isUserExist) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'User already exist'
    });
   
  if (!req.files?.profileImage || req.files?.profileImage.length === 0)
  return next({
    statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
    message: "Image is required",
  });

    let imageURL = await uploadOnCloudinary(req.files?.profileImage[0].path);

    req.body.profileImage = imageURL.secure_url;
    // create user in db
    let user = await createUser(req.body);
    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse(user, "Register successful", res);
});

// login user
export const login = asyncHandler(async (req, res, next) => {

    let user = await findUser({ email: req.body.email })

    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email or password'
    });

    const isMatch = await user.isPasswordCorrect(req.body.password);

    if (!isMatch) return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: 'Invalid password'
    });

    const accessToken = await user.generateAccessToken();
    req.session = { accessToken };

    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse({ user, accessToken }, 'Login successful', res);
});

export const otpGenerate = asyncHandler(async (req, res, next) => {
    
  let {email} = req.body;
 
  const user = await findUser({ email });

  if(!user) return next({
    statusCode: STATUS_CODES.BAD_REQUEST,
    message: 'user doest exist'
});

  const otp = generateRandomOTP()
 
    const otpExpiry = new Date();
    
    otpExpiry.setMinutes(otpExpiry.getMinutes() + parseInt(process.env.OTP_EXPIRATION));

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    
    generateResponse( otp , "OTP generated sucessfully", res);
})

export const otpVerify = asyncHandler(async (req, res, next) => {
    // create user in db
  let {email, otp} = req.body;

    const user = await findUser({ email }).select('+otp +otpExpiry');

    if(!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'user doest exist'
    });

    console.log(user.otp);
    console.log(otp);
    if(parseInt(user.otp) !== parseInt(otp)) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid OTP'
    });


    if(user.otpExpiry < new Date()) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'OTP expired'
    });

    user.otp = null;
    user.otpExpiry = null;


    await user.save();
    
    const acessToken = await user.generateAccessToken(user);

    generateResponse( acessToken , "OTP verified sucessfully", res);
})


export const resetPassword = asyncHandler(async (req, res, next) => {
    // create user in db
  let {newPassword} = req.body;
    
    const user = await findUser({ email:req.user.email, });

    if(!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email'
    });
    
    user.password = newPassword;

    await user.save();
    
    generateResponse( null , "Password reset sucessfully", res);
}
)

export const logout = asyncHandler(async (req, res, next) => {
    req.session = null;
    generateResponse( null , "Logout sucessfully", res);
})

export const getCurrentUser = asyncHandler(async(req,res,next) => {

    const user = await findUser({ _id:req.user.id, });

    if(!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email'
    });

    generateResponse( user , "User found sucessfully", res);
})

export const changePassword = asyncHandler(async(req,res,next) => {
    
        let {oldPassword, newPassword} = req.body;
    
        const user = await findUser({ _id:req.user.id, });
    
        if(!user) return next({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: 'Invalid email'
        });
    
        const isMatch = await user.isPasswordCorrect(oldPassword);
    
        if (!isMatch) return next({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: 'Invalid password'
        });
    
        user.password = newPassword;
    
        await user.save();
        
        generateResponse( null , "Password changed sucessfully", res);
    }   )