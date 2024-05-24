import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dqclwjvcz",
  api_key: "423145119332798",
  api_secret: "LM0-sntf9Yjph6vl6F3MbjiAqMI",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(response.url);
    return response;
    s;
  } catch (error) {
    console.log("Error in file upload:", error);
    fs.unlinkSync(localFilePath);
    throw error; // Re-throw the error after handling
  }
};

export default uploadOnCloudinary;
