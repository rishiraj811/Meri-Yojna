const processIncomingMessage = require('../helpers/processIncomingMessage');
module.exports = (req, res) => {
      let body = req.body;
      if (body.object === 'page') {
            body.entry.forEach(function(entry) {
                  webhook_event = entry.messaging[0];
                  processIncomingMessage(webhook_event);
            });
            res.status(200).send('EVENT_RECEIVED');
      } else {
            res.sendStatus(404);
      }
};
