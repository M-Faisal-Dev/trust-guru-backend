import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SessionSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    sessionLength: {
        type: String,
        required: true
    }
});

const WeekSchema = new Schema({
    weeklyTitle: {
        type: String,
        required: true
    },
    sessions: [SessionSchema]
});

const CourseSchema = new Schema({
    courseTitle: {
        type: String,
        required: true
    },
    coverPicture: {
        type: String,
        default: null
    },
    bannerPicture: {
        type: String,
        default: null
    },
    totalPrice: {
        type: Number,
        required: true
    },
    weeklyPrice: {
        type: Number,
        required: true
    },
    courseDescription: {
        type: String,
        required: true
    },
    studentLearn: {
        type: String,
        required: true
    },
    certificateOption: {
        type: String,
        required: true
    },
    accessOption: {
        type: String,
        required: true
    },
    totalArtical: {
        type: Number,
        required: true
    },
    totalLength: {
        type: String,
        required: true
    },
    totalWeeks: {
        type: Number,
        required: true
    },
    userId : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    weeks: [WeekSchema]
}, {
    timestamps: true
});

const CourseListing = model('CourseListing', CourseSchema);

export default CourseListing;
