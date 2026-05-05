const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  husband: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wife: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marriageDate: { type: Date, default: Date.now },
  story: { type: String, default: "A beautiful match made on Al Fattah Matrimony." },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);
