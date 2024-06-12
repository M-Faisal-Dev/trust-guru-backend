import mongoose from "mongoose";
const Schema = mongoose.Schema;

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
    }
}, {
    timestamps: true
});



const TeacherDetails = mongoose.model('TeacherDetails', UserSchema);
export default TeacherDetails;