const nodemailer = require('nodemailer');
const SMTPTransport = require('nodemailer/lib/smtp-transport');

const mailTransporter = nodemailer.createTransport(new SMTPTransport(
  {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'serhiiptest@gmail.com',
      pass: 'TestLogin02',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  {
    from: 'serhiiptest@gmail.com',
    subject: 'New Password from Freight Delivery',
  },
));

module.exports = { mailTransporter };
