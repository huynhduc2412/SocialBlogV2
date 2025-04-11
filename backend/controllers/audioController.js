const audioService = require('../services/audioService');

// Generate audio from text
const generateAudio = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Text is required.' });
    }

    const audioBuffer = await audioService.generateAudio(text);

    res.setHeader('Content-Type', 'audio/wav');
    res.send(audioBuffer);
  } catch (err) {
    console.error('Audio generation failed:', err);
    res.status(500).json({ message: 'Failed to generate audio.' });
  }
};

module.exports = {
  generateAudio,
};
