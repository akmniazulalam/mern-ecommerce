const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// const uploadImage = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "products" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     stream.end(buffer);
//   });
// };
const uploadImage = async (filename) => {
  const result = await cloudinary.uploader.upload(filename)
  fs.unlinkSync(filename)
  return result;
};


module.exports = uploadImage;