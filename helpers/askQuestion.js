const callSendAPI = require('../facebook/callSendAPI');
const createQuickReplyResponse = require('../facebook/createQuickReplyResponse')

module.exports = async (curr_user, prefix_text, ques_details) => {
      var [configuration,sector,ques]=ques_details
      if (ques.type == 'QUICK_REPLY')
            messenger_response = createQuickReplyResponse(prefix_text + "\n" + ques.messenger_response.text, ques.messenger_response.quick_reply_options)

      else{
            messenger_response = {
                  text: prefix_text + "\n" + ques.messenger_response.text
            }
      }
      await callSendAPI(curr_user.psid, messenger_response)
      curr_user.last_input.configuration = configuration
      curr_user.last_input.sector = sector
      curr_user.last_input.question = ques._id
      curr_user.curr_state = "VALIDATING_RESPONSE"
      await curr_user.save()
      return
}
