const axios = require('axios');
const convertEpochToNormalTime = require('../helpers/convertEpochToNormalTime')
const setTypingBubble = require('./setTypingBubble')
module.exports = async (sender_psid, response) => {
      var messageBody = {
            recipient: {
                  id: sender_psid
            },
            message: response
      }
      const request_body = {
            url: 'https://graph.facebook.com/v7.0/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN,
            headers: {
                  'Content-Type': 'application/json',
            },
            method: 'POST',
            data: JSON.stringify(messageBody)
      }
      await setTypingBubble(sender_psid,"typing_off")
      const curr_time = await convertEpochToNormalTime(Date.now())
      const request = await axios(request_body).then(response => console.log("(" + curr_time + ") " + 'Chatbot: ' + messageBody.message.text)).catch(error => {
            console.log('Message Sending Error! ' + error)
      })
};
