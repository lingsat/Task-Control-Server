const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport(
  {
    service: 'gmail',
    auth: {
      user: 'serhiiptest@gmail.com',
      pass: 'TestLogin02',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
);

module.exports = { mailTransporter };
