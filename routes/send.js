// * node_modules
const Joi = require('@hapi/joi');

const messagePost = (userDetail, smtpTransporter) => ({
  method: 'POST',
  path: '/send',
  options: {
    validate: {
      payload: Joi.object({
        senderName: Joi.string(),
        receiver: Joi.array().items(Joi.string().email()).required(),
        subject: Joi.string().min(2).max(70),
        text: Joi.string(),
        html: Joi.string(),
      }),
    },
  },
  handler: async (request, h) => {
    const { payload } = request;
    const { senderName, receiver, subject, text, html } = payload;
    const info = await smtpTransporter.sendMail({
      from: `"${senderName}" <${userDetail.user}>`, // sender address
      to: receiver, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });
    return info
  },
});

module.exports = { messagePost };
