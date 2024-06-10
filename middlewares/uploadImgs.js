import multer from 'multer';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
  },
});

const multerFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format' }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFileFilter,
  limits: { fileSize: 2000000 },
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
        fs.unlinkSync(`public/images/products/${file.filename}`);
    })
  );
  next();
};

const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/blogs/${file.filename}`);
          fs.unlinkSync(`public/images/blogs/${file.filename}`);

      })
    );
    next();
  };


  const uploadSingleImage = multer({
    storage: multerStorage,
    fileFilter: multerFileFilter,
    limits: { fileSize: 2000000 }, // 2MB limit
  }) // 'image' is the field name in the form
  
  // Function for resizing a single image
  const resizeSingleImage = async (req, res, next) => {
    if (!req.file) return next(); // If no file is uploaded, skip
    try {
      const outputPath = req.file.path.replace(/\.\w+$/, '_resized.jpeg'); // Generate output file path
      await sharp(req.file.path)
        .resize(300, 300) // Resize to 300x300
        .toFormat('jpeg') // Convert to JPEG format
        .jpeg({ quality: 90 }) // Set JPEG quality to 90
        .toFile(outputPath); // Save the resized image to a different file path
      
      // Asynchronously delete the original uploaded image
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
      
      req.file.path = outputPath; // Update the file path in the request object
      next();
    } catch (error) {
      next(error); // Pass any error to the error handler middleware
    }
  };
  
  

export { uploadPhoto, productImgResize,blogImgResize, uploadSingleImage, resizeSingleImage };
