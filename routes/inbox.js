// * node_modules
const _find = require('lodash/find');
const simpleParser = require('mailparser').simpleParser;

const inboxGet = (imapConnection) => ({
  method: 'GET',
  path: '/inbox',
  handler: async (request, h) => {
    const { from = 1, to = 5 } = request.query;
    try {
      await imapConnection.openBox('INBOX');
      const searchCriteria = [`${from}:${to}`];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
      };
      const messages = await imapConnection.search(searchCriteria, fetchOptions);
      return Promise.all(
        messages.map(async (item) => {
          const all = _find(item.parts, { which: '' });
          var id = item.attributes.uid;
          var idHeader = 'Imap-Id: ' + id + '\r\n';
          const mail = await simpleParser(idHeader + all.body);
          return mail;
        }),
      );
    } catch (e) {
      return e;
    }
  },
});

module.exports = { inboxGet };
