'use strict';
// * setup environment variables
require('dotenv').config();
// * node_modules
const Hapi = require('@hapi/hapi');
const imaps = require('imap-simple');
// * routes
const { inboxGet } = require('./routes/inbox');
const { messagePost } = require('./routes/send');
// * configs
const {
  userDetail,
  imapConfig,
  smtpTransporter,
  serverConfig,
} = require('./configs');

const init = async () => {
  const server = Hapi.server(serverConfig);
  try {
    const imapConnection = await imaps.connect(imapConfig);
  } catch (e) {
    console.log('Error is: ', e.type);
  }

  // * inbox
  server.route(inboxGet(imapConnection));

  // * send
  server.route(messagePost(userDetail, smtpTransporter));

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
