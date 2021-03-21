module.exports = (main_text, replies) => {
      //max 3 buttons allowed in facebook
      response_template = {
            "text": "",
            "quick_replies": []
      }
      replies.forEach((title) => {
            response_template.quick_replies.push(QuickReply(title))
      })
      response_template.text = main_text
      return response_template
}

function QuickReply(title) {
      quickreply_template = {
            "content_type": "text",
            "title": "",
            "payload": ""
      }
      quickreply_template.title = title
      quickreply_template.payload = title.replace(/\s+/g, '_').toUpperCase()
      return quickreply_template
}
