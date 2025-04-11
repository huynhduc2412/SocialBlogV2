const ReportItem = require('../models/ReportItem');

const getAllReportItems = async () => {
  return await ReportItem.find();
};

const getReportItemById = async (id) => {
  return await ReportItem.findById(id);
};

const createReportItem = async (reportItemData) => {
  const reportItem = new ReportItem(reportItemData);
  return await reportItem.save();
};

const updateReportItem = async (id, updatedReportItem) => {
  const reportItem = await ReportItem.findById(id);
  if (!reportItem) {
    throw new Error(`ReportItem not found with id: ${id}`);
  }

  reportItem.contentId = updatedReportItem.contentId;
  reportItem.type = updatedReportItem.type;
  reportItem.userReportId = updatedReportItem.userReportId;
  reportItem.percentToxic = updatedReportItem.percentToxic;

  return await reportItem.save();
};

const deleteReportItem = async (id) => {
  const exists = await ReportItem.exists({ _id: id });
  if (!exists) {
    throw new Error(`ReportItem not found with id: ${id}`);
  }
  await ReportItem.findByIdAndDelete(id);
};

module.exports = {
  getAllReportItems,
  getReportItemById,
  createReportItem,
  updateReportItem,
  deleteReportItem,
};
