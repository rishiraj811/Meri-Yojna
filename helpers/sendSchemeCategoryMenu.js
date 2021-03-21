const callSendAPI = require('../facebook/callSendAPI');
const createQuickReplyResponse = require('../facebook/createQuickReplyResponse')

const Configuration = require('../database/models/Configuration')
const GlobalSettings = require('../database/models/GlobalSettings')

module.exports = async (user, error) => {
      if (error == null)
            var message = "Which sector of schemes do you want to view?"
      else if (error == 'delete')
            var message = "What sector of data do you want to delete?"
      else
            var message = "I didn't understand. Please select your choice again."
      var quick_reply_options=[]
      configuration = (await GlobalSettings.findOne().populate('configuration')).configuration
      for (var i=0;i<configuration.sector.length;i++){
            quick_reply_options.push(configuration.sector[i].name)
      }
      if (error == 'delete') {
            user.curr_state = 'WAITING_FOR_DELETE_RESPONSE'
            quickreply_options.push({
                  title: "All Data",
                  payload: "ALL_DATA"
            })
      } else
            user.curr_state = "WAITING_FOR_CATEGORY_RESPONSE"
      await callSendAPI(user.psid, await createQuickReplyResponse(message, quickreply_options))
      await user.save()
}
