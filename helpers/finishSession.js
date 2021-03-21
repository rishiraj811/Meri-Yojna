const getAllSchemes = require('./getAllSchemes')
const matchUserInfoAgainstCriteria = require('./matchUserInfoAgainstCriteria')
const sendSchemeCategoryMenu = require('./sendSchemeCategoryMenu')
const callSendAPI = require('../facebook/callSendAPI');

module.exports = async (user) => {
      if (user.last_input.category == "GENERAL")
            await sendSchemeCategoryMenu(user, null)
      else{
            ministries = ["MoHFW", "MoMA"]
            categories = ["HEALTH", "MINORITY"]
            schemes = await getAllSchemes(user.personal_info, ministries[categories.indexOf(user.last_input.category)])
            if(schemes.length==0){
                  var response = 'Currently, you are not eligible for any schemes in this sector. :(\nAlthough, you can check various other sectors for eligible schemes. :)\n'
            }
            else{
                  var response = 'You are eligible for following schemes:\n'
                  var index = 1
                  for (var scheme of schemes) {
                        response += index + '. ' + scheme.scheme_name
                        if (index != schemes.length)
                              response += '\n'
                        index += 1
                  }
            }
            await callSendAPI(user.psid, {
                  text: response
            })
      }
}
