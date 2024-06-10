// import Thumbnail from "../models/thumbnailModel.js";
import ProfileImg from "../models/profileImage.js";

import asyncHandler from "express-async-handler";
import validateMongoId from "../ulits/validateMongodbId.js";




const uploadProfile = asyncHandler(async (req, res) => {
    try {
        const baseUrl = req.protocol + '://' + req.get('host'); // Get base URL of the server
        
        // Get the file details from the request
        const { path } = req.file;
        const relativePath = path.replace(/^.*public/, ''); // Convert absolute path to relative path
        const imageUrl = baseUrl + relativePath; // Concatenate base URL with relative path
  
        console.log(imageUrl, "this is img url"
        )
        // Store the image URL in the database
        const createImage = await ProfileImg.create({ image: imageUrl });
  
        // Send the response with the created image data
        res.json(createImage);
  
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// const thumbnailImg = asyncHandler(async (req, res) => {
//   try {
//       const uploader = (path) => uploadFileToCloudinary(path, "images");
//       const file = req.file;
//       console.log(file)

//       const { path } = file;
//       const newPath = await uploader(path);
//       fs.unlinkSync(path);
//       const createImage = await Thumbnail.create({ images: newPath });

//       // Send the response with the created image data
//       res.json(createImage);

//   } catch (err) {
//       console.error("Error uploading images:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//   }
// });





  
  
  const deleteImgs = asyncHandler(async(req, res) => {
    const {id} = req.params;
    try{
      const Deleted = deleteFileFromCloudinary(id, "images");
      res.json({message: "Image deleted successfully"})
    
   
    }catch(err){
      throw new Error(err)
    }
  })










  export {
    deleteImgs,
    uploadProfile,

   
   
}