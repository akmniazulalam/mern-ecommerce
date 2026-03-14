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
  const result = await cloudinary.uploader.upload(filename) //ekhane filename ta hocche productController er uploadImage er moddhe je imagePath naame ekta variable pass kora hoyechilo setakei ekhane filename naame pass kora hoyeche. filename ta hocche muloto imagePath jar moddhe ache image er path ta jeta user er image upload korar sathe sathe uploads folder e eshe joma hoy.
  fs.unlinkSync(filename) //image cloudinary te upload howar por server theke mane ekhaner je uploads folder e eshe joma hoyechilo image ta seta delete hoye jabe
  return result;
};


module.exports = uploadImage;