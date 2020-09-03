'use strict';

const Hapi = require('@hapi/hapi');
const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _find = require('lodash/find');

const config = {
  imap: {
    user: 'Mail',
    password: 'Password',
    host: 'webmail.aut.ac.ir',
    port: 993,
    tls: true,
  },
};

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');
        const searchCriteria = ['1:5'];
        const fetchOptions = {
          bodies: ['HEADER', 'TEXT', ''],
        };
        const messages = await connection.search(searchCriteria, fetchOptions);
        return Promise.all(messages.map(async (item) => {
          const all = _find(item.parts, { which: '' });
          var id = item.attributes.uid;
          var idHeader = 'Imap-Id: ' + id + '\r\n';
          const mail = await simpleParser(idHeader + all.body);
          return mail
        }));
      } catch (e) {
        return e;
      }
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
