Scheme = require('../database/models/Scheme')
User = require('../database/models/User')
Question = require('../database/models/Question')
matchUserInfoAgainstCriteria = require('./matchUserInfoAgainstCriteria')
module.exports = async (personal_info,ministry) => {
      eligible_schemes = []
      all_schemes = await Scheme.find({ministry_name:ministry})
      for(scheme of all_schemes){
            var flag=false
            for(criteria of scheme.criteria){
                  if (await matchUserInfoAgainstCriteria(criteria.toJSON(),personal_info)){
                        flag=true
                        break
                  }
            }
            if (flag) {eligible_schemes.push(scheme.toJSON())}
      }
      return eligible_schemes
}
