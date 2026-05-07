const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  location: { type: String },
  maritalStatus: { type: String, default: "" },
  phone: { type: String },
  job: { type: String },
  education: { type: String, default: ""},
  salary: { type: String },
  assets: { type: String },
  description: { type: String },
  profilePhoto: { type: String, default: "" },
  gender: { type: String, default: "" },
  // --- Admin-controlled fields ---
  isAdminApproved: { type: Boolean, default: false },
  hasPaid: { type: Boolean, default: false },
  isMarried: { type: Boolean, default: false },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // --- OTP Reset fields ---
  resetOtp: { type: String },
  resetOtpExpire: { type: Date },
  otpRequestedAt: { type: Date },

  registrationDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);