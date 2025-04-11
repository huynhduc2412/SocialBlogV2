const generateAudio = async (text) => {
  const flaskUrl = 'http://localhost:5002/generate-audio';

  try {
    const response = await fetch(flaskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(
        `Flask service error: ${response.status} ${response.statusText}`
      );
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.error('Error calling Flask TTS API:', error);
    throw error;
  }
};

module.exports = {
  generateAudio,
};
