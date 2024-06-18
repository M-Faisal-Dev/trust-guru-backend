import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const purchasedCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseListing',
    required: true
  },
  courseTitle: {
    type: String,
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  plan: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const studentPurchaseSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseListing',
    required: true
  },
  courseTitle: {
    type: String,
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  plan: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    confirmPassword: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      enum: ['Teacher', 'student'],
      default: 'Student', // Assuming 'Student' is the correct default userType
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    isBlocked: { type: Boolean, default: false },
    courseOptions: [],
    languageOptions: [],
    profileImg: [],
    address: {
      type: String,
    },
    refreshToken: { type: String },
    purchasedCourses: [purchasedCourseSchema],
    purchases: [studentPurchaseSchema],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiresAt: Date,
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherDetails"
    },
    listedCourseId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseListing"
    }],
    bankDetails: {
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
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = this.password;
  }
  next();
});

userSchema.methods.isPasswordMatch = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetTokenExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
