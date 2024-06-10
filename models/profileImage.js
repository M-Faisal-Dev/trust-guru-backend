import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define asset schema
const AssetSchema = new Schema({
  // Fields for images and videos
  image: [],
}, { timestamps: true });

// Create and export model
const ProfileImage = mongoose.model('ProfileImage', AssetSchema);
export default ProfileImage;
