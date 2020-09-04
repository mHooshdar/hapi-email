// * node_modules
const nodemailer = require('nodemailer');


const serverConfig = {
  port: 3000,
  host: 'localhost',
};

const userDetail = {
  user: 'MAIL',
  password: 'PASSWORD',
  host: 'webmail.aut.ac.ir',
  imapPort: 993,
  smtpPort: 25,
};

const imapConfig = {
  imap: {
    user: userDetail.user,
    password: userDetail.password,
    host: userDetail.host,
    port: userDetail.imapPort,
    tls: true,
  },
};

// create reusable transporter object using the default SMTP transport
const smtpTransporter = nodemailer.createTransport({
  host: userDetail.host,
  port: userDetail.smtpPort,
  secure: false, // true for 465, false for other ports
  auth: {
    user: userDetail.user,
    pass: userDetail.password,
  },
});

module.exports = { serverConfig, userDetail, imapConfig, smtpTransporter };
