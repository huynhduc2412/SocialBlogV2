const postService = require('./postService');
const commentService = require('./commentService');
const notificationService = require('./notificationService');
const reportItemModel = require('../models/ReportItem');

const flaskUrl = 'http://localhost:5001/api/perspective/analyze';

const analyzeText = async ({ text, type, id, user }) => {
  try {
    const response = await fetch(flaskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Flask service returned ${response.status}`);
    }

    const data = await response.json();

    const score = data?.attributeScores?.TOXICITY?.summaryScore?.value ?? null;

    if (score === null) {
      throw new Error('Could not extract toxicity score from response');
    }

    const toxicityPercent = score * 100;
    await handleToxicContent({ type, id, toxicityPercent, user });

    return score;
  } catch (error) {
    console.error('Perspective analysis failed:', error);
    throw error;
  }
};

const handleToxicContent = async ({ type, id, toxicityPercent, user }) => {
  if (toxicityPercent >= 70) {
    let userId;

    if (type === 'Post') {
      userId = await postService.deletePostR(id);
      await sendUserDeleteNotice(userId, 'Post');
    } else if (type === 'Com') {
      userId = await commentService.deleteCommentR(id);
      await sendUserDeleteNotice(userId, 'Comment');
    }
  } else {
    if (!user || !user.userId) {
      throw new Error('User information is required to create a report item');
    }

    await reportItemModel.create({
      contentId: id,
      type,
      percentToxic: toxicityPercent,
      userReportId: user.userId,
    });
  }
};

const sendUserDeleteNotice = async (userId, type) => {
  await notificationService.createNotification(
    userId,
    `${type} deleted`,
    `Your ${type.toLowerCase()} was considered harmful and inappropriate.`
  );
};

module.exports = {
  analyzeText,
};
