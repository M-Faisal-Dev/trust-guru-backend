import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
  cloud_name: 'dnfktmgnt', 
  api_key: '867316377542546', 
  api_secret: 'qdNvXiUhxTcON4bR37S6e5qbvHo',
  secure: true,
});

async function uploadFileToCloudinary(file) {
  try {
    let result;
    // Determine the file type based on its extension
    const fileType = getFileType(file);

    // Upload the file to Cloudinary with appropriate resource type
    if (fileType === 'image') {
      result = await cloudinary.v2.uploader.upload(file, { resource_type: "image" });
    } else if (fileType === 'video') {
      result = await cloudinary.v2.uploader.upload(file, { resource_type: "video" });
    } else if (fileType === 'pdf') {
      result = await cloudinary.v2.uploader.upload(file, { resource_type: "raw" });
    } else {
      throw new Error('Unsupported file type');
    }

    const url = result.secure_url; 
    const asset_id = result.asset_id; 
    const public_id = result.public_id;

    return { url, asset_id, public_id };

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Rethrow the error if needed
  }
}

// Helper function to determine file type based on extension
function getFileType(file) {
  const extension = file.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
    return 'image';
  } else if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
    return 'video';
  } else if (extension === 'pdf') {
    return 'pdf';
  } else {
    return 'unknown';
  }
}

async function deleteFileFromCloudinary(public_id) {
  try {
    const result = await cloudinary.v2.uploader.destroy(public_id);
    return result;

  } catch (error) {
    console.error('Error deleting file:', error);
    // Handle the error appropriately
    throw error; // Rethrow the error if needed
  }
}

export { uploadFileToCloudinary, deleteFileFromCloudinary };
