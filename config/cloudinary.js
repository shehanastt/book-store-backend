// // config/cloudinary.js
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

// // configure your cloudinary credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // create multer storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "bookstore", // optional folder in your Cloudinary dashboard
//     allowed_formats: ["jpg", "jpeg", "png", "webp"],
//     public_id: (req, file) => {
//       const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//       return `${file.fieldname}-${uniqueName}`;
//     },
//   },
// });

// export { cloudinary, storage };
