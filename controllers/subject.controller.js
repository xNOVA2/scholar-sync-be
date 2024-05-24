import { createSubject, fetchSubjects } from '../models/subject.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

const createSubjects = asyncHandler(async (req, res, next) => {
    
  if (!req.files?.picture || req.files?.picture.length === 0)
  return next({
    statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
    message: "Image is required",
  });

    console.log(req.files?.picture[0].path);
    let imageURL = await uploadOnCloudinary(req.files?.picture[0].path);

    req.body.picture = imageURL.secure_url;


    const subject = await createSubject(req.body);
    generateResponse(subject, 'Subject created successfully', res);
}   );


const fetchSubject = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const subjects = await fetchSubjects({class:id});
    generateResponse(subjects, 'Subjects fetched successfully', res);
}); 

export { createSubjects,fetchSubject }