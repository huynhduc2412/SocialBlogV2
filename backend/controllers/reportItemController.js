const reportItemService = require('../services/reportItemService');

const getAllReportItems = async (req, res) => {
  try {
    const reportItems = await reportItemService.getAllReportItems();
    res.status(200).json(reportItems);
  } catch (error) {
    console.error('Error fetching report items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getReportItemById = async (req, res) => {
  try {
    const reportItem = await reportItemService.getReportItemById(req.params.id);
    if (!reportItem) {
      return res.status(404).json({ message: 'ReportItem not found' });
    }
    res.status(200).json(reportItem);
  } catch (error) {
    console.error('Error fetching report item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createReportItem = async (req, res) => {
  try {
    const reportItem = await reportItemService.createReportItem(req.body);
    res.status(201).json(reportItem);
  } catch (error) {
    console.error('Error creating report item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateReportItem = async (req, res) => {
  try {
    const updatedReportItem = await reportItemService.updateReportItem(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedReportItem);
  } catch (error) {
    console.error('Error updating report item:', error);
    res.status(404).json({ message: 'ReportItem not found' });
  }
};

const deleteReportItem = async (req, res) => {
  try {
    await reportItemService.deleteReportItem(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting report item:', error);
    res.status(404).json({ message: 'ReportItem not found' });
  }
};

module.exports = {
  getAllReportItems,
  getReportItemById,
  createReportItem,
  updateReportItem,
  deleteReportItem,
};
