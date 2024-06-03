import { createSubject, fetchSubject, fetchSubjects } from '../models/subject.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';
import { STATUS_CODES } from '../utils/constants.js';
import { generateResponse, asyncHandler } from '../utils/helpers.js';

const createSubjects = asyncHandler(async (req, res, next) => {
    const { subject, class: newClasses } = req.body;

    // Fetch the subject
    const findSubject = await fetchSubject({ subject });

    // If the subject exists
    if (findSubject) {
      // Find classes in req.body.class that are not in findSubject.class
      const classesNotInFindSubject = newClasses.filter(c => !findSubject.class.includes(c));
      console.log(classesNotInFindSubject);

      // If there are new classes to add
      if (classesNotInFindSubject.length > 0) {
        findSubject.class.push(...classesNotInFindSubject);
        await findSubject.save();
      }

      // Return response
      return generateResponse(findSubject, 'Classes updated successfully', res);
    }

    // If the subject doesn't exist, create it
    
    if (!req.files?.picture || req.files?.picture.length === 0) {
      return next({
        statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
        message: "Image is required",
      });
    }

    let imageURL = await uploadOnCloudinary(req.files?.picture[0].path);
    req.body.picture = imageURL.secure_url;

    const newSubject = await createSubject(req.body);

    // Return response for subject creation
    return generateResponse(newSubject, 'Subject created successfully', res);

});


const getSubjects = asyncHandler(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const subjectName = req.query.subject;
    const classNumber = parseInt(req.query.class, 10); // parse class to an integer

    const pipeline = [];

    if (subjectName) {
      pipeline.push({ $match: { subject: subjectName } });
    }

    if (!isNaN(classNumber)) {
      pipeline.push({ $match: { class: { $in: [classNumber] } } });
    }

    const subjects = await fetchSubjects({query:pipeline,limit,page});
    console.log(subjects);
    generateResponse(subjects, 'Subjects fetched successfully', res);
  } catch (error) {
    next(error);
  }
});


export { createSubjects,getSubjects }