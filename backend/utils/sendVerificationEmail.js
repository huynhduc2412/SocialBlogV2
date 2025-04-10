const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

module.exports = async function sendVerificationEmail(email, code) {
  const url = `${process.env.BASE_URL}/verify/${code}`;
  await transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: 'Xác minh tài khoản SocialBlog',
    html: `<p>Nhấn vào link dưới đây để xác minh tài khoản:</p><a href="${url}">Verify Account</a>`
  });
};
