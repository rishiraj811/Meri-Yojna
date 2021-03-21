const convertEpochToNormalTime = require('./convertEpochToNormalTime');
module.exports = async (webhook_event) => {
     //sender psid
     var sender_psid = webhook_event.sender.id

     //epoch time to normal time
     var timestamp = await convertEpochToNormalTime(webhook_event.timestamp)

     //message type
     var message_type
     if ("postback" in webhook_event) {
          message_type = "POSTBACK"
     } else if ("message" in webhook_event) {
          if ("quick_reply" in webhook_event.message)
               message_type = "QUICK_REPLY"
          else if ("text" in webhook_event.message)
               message_type = "NORMAL_TEXT"
          else message_type = "UNKNOWN_TYPE"
     } else message_type = "UNKNOWN_TYPE"

     //message string
     var content

     if (message_type == "POSTBACK")
          content = webhook_event.postback.title + " (POSTBACK)"
     else if (message_type == "QUICK_REPLY" || message_type == "NORMAL_TEXT")
          content = webhook_event.message.text + " (" + message_type + ")"
     else
          content = "Error, not a text message!"

     const formatted_message_string = ("(" + timestamp + ")" + " " + 'User(' + webhook_event.sender.id + ")" + ": " + content)

     return [sender_psid,timestamp,message_type,formatted_message_string]
}
