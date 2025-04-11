const perspectiveService = require('../services/perspectiveService');

const analyzeComment = async (req, res) => {
  try {
    const { text, type, id } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await perspectiveService.analyzeText({
      text,
      type,
      id,
      user: req.user,
    });

    res.status(200).json({ toxicityValue: result });
  } catch (err) {
    console.error('Error analyzing text:', err);
    res.status(500).json({ error: err.message || 'Unexpected error occurred' });
  }
};

module.exports = {
  analyzeComment,
};
