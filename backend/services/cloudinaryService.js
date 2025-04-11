const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileBuffer) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      });
      stream.end(fileBuffer);
    });
  } catch (err) {
    throw new Error('Image upload failed');
  }
};

module.exports = { uploadImage };
