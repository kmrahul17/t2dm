const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  isPregnant: { type: Boolean, default: false },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
