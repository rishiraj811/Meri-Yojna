const request = require('request');
module.exports = async () => {
     var messageBody = {
          get_started: {
               payload: "GET_STARTED"
          }
     }
     const request_body = {
          url: 'https://graph.facebook.com/v7.0/me/messenger_profile?access_token=' + process.env.PAGE_ACCESS_TOKEN,
          headers: {
               'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(messageBody)
     }
     return await request(request_body, (err, res, body) => {
          if (!err) {
               console.log('Get Started Button Set!')
          } else {
               console.error('Get Started Error!'+err);
          }
     });
};
