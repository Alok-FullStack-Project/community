// models/Counter.js
const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "42KPS" or "42KPS-0001-members"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Counter', CounterSchema);
