const matchUserInfoAgainstCriteria = require('./matchUserInfoAgainstCriteria')

const User = require('../database/models/User')
const Question = require('../database/models/Question')
const Configuration = require('../database/models/Configuration')
const GlobalSettings = require('../database/models/GlobalSettings')

module.exports = async (user) => {
      // console.log(user)
      configuration = (await GlobalSettings.findOne().populate('configuration')).configuration
      general_questions = configuration.general_questions
      for(var i=0;i<general_questions.length;i++){
            curr_question_id =  (await general_questions.find(question => question.position==i)).question
            if(user.personal_info.find(personal_info => personal_info.question.equals(curr_question_id))==undefined){
                  return ([configuration,"GENERAL",await Question.findOne({_id: curr_question_id})])
            }
      }
      return null
      // if(category== null){
      //       questions = await Question.find({
      //             category: user.last_input.category
      //       })
      // }
      // else {
      //       questions = await Question.find({
      //             category
      //       })
      // }
      // for (question of questions) {
      //       if (user.personal_info[question.name] == undefined){
      //             if (await matchUserInfoAgainstCriteria(question.dependencies, user.personal_info)) {
      //                   return question
      //             }
      //       }
      // }
      return null
}
