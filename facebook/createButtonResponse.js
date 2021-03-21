module.exports = (main_text, buttons) => {
     //max 3 buttons allowed in facebook
     response_template = {
          "attachment": {
               "type": "template",
               "payload": {
                    "template_type": "button",
                    "text": "",
                    "buttons": []
               }
          }
     }
     buttons.forEach((item) => {
          response_template.attachment.payload.buttons.push(Button(item.title, item.payload))
     })
     response_template.attachment.payload.text = main_text
     return response_template
}

function Button(title,payload) {
     postback_button_template = {
          "type": "postback",
          "title": "",
          "payload": ""
     }
     postback_button_template.title = title
     postback_button_template.payload=payload
     return postback_button_template
}
