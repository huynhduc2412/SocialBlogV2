// models/ReportItem.js
const mongoose = require('mongoose');

const ReportItemSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    userReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Liên kết với model User
      required: true,
    },

    percentToxic: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReportItem', ReportItemSchema);
