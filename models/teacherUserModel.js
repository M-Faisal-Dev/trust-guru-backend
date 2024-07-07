import mongoose from "mongoose";
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    skill: {
      type: String,
    },
    skillPercentage: {
      type: String,
    },
  })

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    about: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
    },
    dob: {
        type: Date,
        default: null
    },
    bankName: {
        type: String,
        default: ''
    },
    iban: {
        type: String,
        default: ''
    },
    accNumber: {
        type: String,
        default: ''
    },
    biography: {
        type: String,
      },
      skills: [skillSchema],
      totalPoints: { type: Number, default: 0 },
      lastMonth: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      numClients: { type: Number, default: 0 },
}, {
    timestamps: true
});



const TeacherDetails = mongoose.model('TeacherDetails', UserSchema);
export default TeacherDetails;