const callSendAPI = require('../facebook/callSendAPI');
const createQuickReplyResponse = require('../facebook/createQuickReplyResponse')
module.exports = async (user, error) => {
      if (user.personal_info.length == 0) {
            if (error == null)
                  var message = "Hi " + user.fb_personal_info.first_name + ", I am an intelligent assistant developed by AEG India. To know about schemes you are eligible for, tap Yes!"
            else
                  var message = "I didn't understand. Do you want to proceed?"
            var quickreply_options = ["Yes","No"]
            user.curr_state = "NEW_SESSION+WAITING_FOR_RESPONSE"
            await user.save()
      } else {
            if (error == null)
                  var message = "Hello " + user.fb_personal_info.first_name + ", What do you want me to do?"
            else
                  var message = "I didn't understand. What do you want me to do?"
            var quickreply_options = ["View Schemes","Show Personal Data","Delete My Data!"]
            user.curr_state = "MAIN_MENU_RESPONSE"
            await user.save()
      }
      await callSendAPI(user.psid, await createQuickReplyResponse(message, quickreply_options))
}
