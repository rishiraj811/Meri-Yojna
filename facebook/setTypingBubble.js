const request = require('request');
module.exports = async (sender_psid, response) => {
     var messageBody = {
          recipient: {
               id: sender_psid
          },
          sender_action: response
     }
     const request_body = {
          url: 'https://graph.facebook.com/v7.0/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
          headers: {
               'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(messageBody)
     }
     await request(request_body, (err, res, body) => {
          if (!err) {
               console.log('Typing Bubble Set!')
          } else {
               console.error("Unable to set typing bubble");
          }
     });
};
