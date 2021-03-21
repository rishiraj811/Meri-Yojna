const request = require('request');
module.exports = async () => {
     var messageBody = {
          persistent_menu: [{
               locale: "default",
               composer_input_disabled: false,
               call_to_actions: [{
                     type: "postback",
                    title: "Main Menu",
                    payload: "MAIN_MENU"
              },
              {
                    type: "postback",
                    title: "About Us",
                    payload: "ABOUT_US"
              }]
          }]
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
               console.log('Persistent Menu Set!')
          } else {
               console.error("Error in Persistent Menu!");
          }
     });
}
