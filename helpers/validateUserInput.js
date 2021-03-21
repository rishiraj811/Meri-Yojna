const Question = require('../database/models/Question')
const recognizeStateInput = require('./recognizeStateInput')
module.exports = async(question,message_type,message) => {
      var error = null
      var converted_data_for_database = null
      var entered_value = null

      if(question.type=='NORMAL_TEXT'){
            if(message_type=='NORMAL_TEXT'){
                  converted_data_for_database = message.text
            }
            else error = question.error_message
      }
      else if (question.type=='STATE'){
            if(message_type=='NORMAL_TEXT'){
                  [converted_data_for_database, error] = await recognizeStateInput(message.text)
            }
            else error = question.error_message
      }
      else if(question.type=='DATE'){
            if(message_type=='NORMAL_TEXT'){
                  if(message.nlp.entities.datetime!=undefined){
                        converted_data_for_database = new Date(message.nlp.entities.datetime[0].value)
                        converted_data_for_database = converted_data_for_database.getDate()+' '+converted_data_for_database.toLocaleString('default', { month: 'long' })+' '+ converted_data_for_database.getFullYear()
                  }
                  else error = question.error_message
            }
            else error = question.error_message
      }
      else if(question.type=='MONEY'){
            if(message_type=='NORMAL_TEXT'){
                  if(message.nlp.entities.amount_of_money!=undefined){
                        converted_data_for_database=message.nlp.entities.amount_of_money[0].value
                        entered_value="Rs. "+converted_data_for_database
                  }
                  else error = question.error_message
            }
            else error = question.error_message
      }
      else if(question.type=='QUICK_REPLY'){
            if(message_type=='QUICK_REPLY'){
                  converted_data_for_database = message.text
            }
            else error=question.validation.error_message
      }
      if(message_type=='QUICK_REPLY')
            entered_value=message.text
      else {
            if(entered_value==null)
                  entered_value=converted_data_for_database
      }
      return [entered_value, converted_data_for_database, error]
}
