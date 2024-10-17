// import multer from 'multer';
// import path from 'path';

// // Define storage strategy
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads'); // Destination folder for uploaded files
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, `${file.fieldname}-${Date.now()}${ext}`); // Append timestamp to avoid naming conflicts
//     }
// });

// // File filter to restrict file types (optional)
// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only images are allowed.'), false);
//     }
// };

// // Create multer instance
// const upload = multer({ storage, fileFilter });

// export default upload;
