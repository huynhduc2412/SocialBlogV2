const cloudinaryService = require('../services/cloudinaryService');

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (file.size > MAX_FILE_SIZE) {
      return res.status(413).json({ message: "File size exceeds 5MB" });
    }

    const imageUrl = await cloudinaryService.uploadImage(file.buffer);

    res.status(200).type('text/plain').send(imageUrl);

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
};
