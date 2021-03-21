//fb modules
const callSendAPI = require('../facebook/callSendAPI');
const createQuickReplyResponse = require('../facebook/createQuickReplyResponse')
const createButtonResponse = require('../facebook/createButtonResponse')
const setTypingBubble = require('../facebook/setTypingBubble')

//database modules
const User = require('../database/models/User')
const Question = require('../database/models/Question')
const Configuration = require('../database/models/Configuration')
const GlobalSettings = require('../database/models/GlobalSettings')

//helper modules
const analyzeIncomingMessage = require('./analyzeIncomingMessage')
const createUser = require('./createUser')
const validateUserInput = require('./validateUserInput')
const getAllSchemes = require('./getAllSchemes')
const matchUserInfoAgainstCriteria = require('./matchUserInfoAgainstCriteria')
const sendMainMenu = require('./sendMainMenu')
const finishSession = require('./finishSession')
const getQuestionToAsk = require('./getQuestionToAsk')
const sendSchemeCategoryMenu = require('./sendSchemeCategoryMenu')
const askQuestion = require('./askQuestion')


async function sleep(ms) {
      return new Promise((resolve) => {
            setTimeout(resolve, ms);
      });
}
module.exports = async (webhook_event) => {
      const [sender_psid, timestamp, message_type, formatted_message_string] = await analyzeIncomingMessage(webhook_event)
      console.log(formatted_message_string)
      await setTypingBubble(sender_psid, "typing_on")

      var curr_user = await User.findOne({
            psid: sender_psid
      })

      if (curr_user == null) {
            curr_user = await createUser(sender_psid)
      }

      if (message_type == "POSTBACK") {
            if (webhook_event.postback.payload == 'GET_STARTED' || webhook_event.postback.payload == 'MAIN_MENU')
                  await sendMainMenu(curr_user, null)
            else if (webhook_event.postback.payload == 'ABOUT_US') {
                  await callSendAPI(sender_psid, {
                        text: (await GlobalSettings.findOne()).about_us
                  })
            }
            await curr_user.save()
            return
      }

      if (curr_user.curr_state == "NEW_SESSION") {
            await sendMainMenu(curr_user, null)
            curr_user.curr_state = "NEW_SESSION+WAITING_FOR_RESPONSE"
            await curr_user.save()
            return
      }

      if (curr_user.curr_state == "NEW_SESSION+WAITING_FOR_RESPONSE") {
            if (message_type == "QUICK_REPLY") {
                  if (webhook_event.message.quick_reply.payload == "NO") {
                        await callSendAPI(webhook_event.sender.id, {
                              text: "Goodbye! " + curr_user.fb_personal_info.first_name + ". To access our services again, send us a message :)"
                        })
                        curr_user.curr_state = "NEW_SESSION"
                        await curr_user.save()
                        return
                  } else if (webhook_event.message.quick_reply.payload == "YES") {
                        await askQuestion(curr_user, "Let's get started with some basic questions.", await getQuestionToAsk(curr_user))
                        return
                  }
            } else {
                  await sendMainMenu(curr_user, "error")
                  curr_user.curr_state = "NEW_SESSION+WAITING_FOR_RESPONSE"
                  await curr_user.save()
                  return
            }
      }

      if (curr_user.curr_state == 'MAIN_MENU_RESPONSE') {
            if (message_type == 'QUICK_REPLY') {
                  if (webhook_event.message.quick_reply.payload == 'DELETE_MY_DATA!') {
                        await sendSchemeCategoryMenu(curr_user, 'delete')
                  } else if (webhook_event.message.quick_reply.payload == 'SHOW_PERSONAL_DATA') {
                        if (Object.keys(curr_user.personal_info.toJSON()).length != 0) {
                              info = curr_user.personal_info.toJSON()
                              if (Object.keys(info).length != 1)
                                    response = "You have answered " + Object.keys(info).length + " questions till now.\n\n"
                              else
                                    response = "You have answered only one question till now.\n\n"

                              for (property in info) {
                                    curr_ques = await Question.findOne({
                                          name: property
                                    })
                                    if (curr_ques.messenger_response.type == 'NORMAL_TEXT')
                                          response += curr_ques.label + ": " + curr_user.personal_info[property]
                                    else {
                                          for (element of curr_ques.messenger_response.quick_reply_options) {
                                                if (element.payload == curr_user.personal_info[property]) {
                                                      response += curr_ques.label + ": " + element.title
                                                      break
                                                }
                                          }
                                    }
                                    response += "\n"
                              }
                              await callSendAPI(sender_psid, {
                                    text: response
                              })
                        } else {
                              await callSendAPI(sender_psid, {
                                    text: "Currently, you have no personal data on our servers :)\n"
                              })
                              await setTypingBubble(sender_psid, "typing_on")
                              await sendMainMenu(curr_user, "button")
                        }
                  } else if (webhook_event.message.quick_reply.payload == 'VIEW_SCHEMES') {
                        var ques_details = await getQuestionToAsk(curr_user)
                        if (ques_details[1] == "GENERAL") {
                              await askQuestion(curr_user, "Let's get started with some basic questions.", ques_details)
                              return
                        } else {
                              await sendSchemeCategoryMenu(curr_user, null)
                              curr_user.last_state = "SCHEMES_CATEGORY_RESPONSE"
                              await curr_user.save()
                        }
                        await curr_user.save()
                  }
                  return
            } else {
                  await sendMainMenu(curr_user, "error")
                  curr_user.curr_state = "MAIN_MENU_RESPONSE"
                  return
            }
      }

      if (curr_user.curr_state == "VALIDATING_RESPONSE") {
            var [validated_input, converted_data_for_database, error] = await validateUserInput(await Question.findOne({
                  _id: curr_user.last_input.question
            }), message_type, webhook_event.message)
            if (error == null) {
                  curr_user.last_input.answer = converted_data_for_database
                  if (message_type == 'QUICK_REPLY') {
                        await saveAndNext(curr_user)
                        return
                  } else {
                        await callSendAPI(sender_psid, createQuickReplyResponse("You entered " + validated_input + "\nIs that correct?", ["Yes", "No"]))
                        curr_user.curr_state = "CHECK_CONFIRMATION_RESPONSE"
                        await curr_user.save()
                        return
                  }
            } else {
                  console.log(error)
                  await askQuestion(curr_user, error + '\nPlease Try Again.', curr_user.last_input)
                  return
            }
      }
      if (curr_user.curr_state == "CHECK_CONFIRMATION_RESPONSE") {
            if (message_type == "QUICK_REPLY") {
                  if (webhook_event.message.quick_reply.payload == "YES") {
                        await saveAndNext(curr_user)
                        return
                  } else if (webhook_event.message.quick_reply.payload == "NO") {
                        await askQuestion(curr_user, "Okay then, let's try again.", curr_user.last_input)
                        return
                  }
            }
      }
      //
      // if (curr_user.curr_state == "WAITING_FOR_CATEGORY_RESPONSE") {
      //       if (message_type == 'QUICK_REPLY') {
      //             category = webhook_event.message.quick_reply.payload
      //             category = category.substring(8, category.length)
      //             curr_user.last_input.category = category
      //             await curr_user.save()
      //             var ques_to_ask = await getQuestionToAsk(curr_user)
      //             if (ques_to_ask == null) {
      //                   curr_user.curr_state = "FINISHED"
      //                   await curr_user.save()
      //                   await finishSession(curr_user)
      //                   return
      //             } else {
      //                   await askQuestion(curr_user, "Just a few questions more.", ques_to_ask)
      //                   return
      //             }
      //       } else {
      //             await sendSchemeCategoryMenu(curr_user, 'error')
      //       }
      // }
      // if (curr_user.curr_state == 'WAITING_FOR_DELETE_RESPONSE') {
      //       if (message_type == 'QUICK_REPLY') {
      //             if (webhook_event.message.quick_reply.payload == 'ALL_DATA') {
      //
      //                   await callSendAPI(sender_psid, {
      //                         text: "We are removing all of your personal data from our servers.\nTo access our services again, send us a message :)"
      //                   })
      //                   await User.deleteOne(curr_user)
      //             } else {
      //                   theme = webhook_event.message.quick_reply.payload
      //                   theme = theme.substring(8, theme.length)
      //
      //                   await callSendAPI(sender_psid, {
      //                         text: ("We are removing " + theme.toLowerCase() + " schemes related data from our servers.\nYou can again know about " + theme.toLowerCase() + " schemes from the main menu. :)")
      //                   })
      //                   questions = await Question.find({
      //                         category: theme
      //                   })
      //                   for (question of questions) {
      //                         curr_user.personal_info[question.name] = undefined
      //                   }
      //                   await curr_user.save()
      //             }
      //       } else {
      //             await sendSchemeCategoryMenu(curr_user, 'delete')
      //       }
      // }
      // if (curr_user.curr_state == "FINISHED") {
      //       await callSendAPI(sender_psid, {
      //             text: "Please open the main menu for accessing our services again :)"
      //       })
      // }
}
async function saveAndNext(curr_user) {
      if (curr_user.personal_info.find(personal_info => personal_info.question == curr_user.last_input.question) == undefined) {
            curr_user.personal_info.push({
                  question: curr_user.last_input.question,
                  answer: curr_user.last_input.answer
            })
      } else {
            curr_user.personal_info.find(personal_info => personal_info._id == curr_user.last_input.question).answer = curr_user.last_input.answer
      }
      await curr_user.save()
      ques_details = await getQuestionToAsk(curr_user)
      if (ques_details == null) {
            curr_user.curr_state = "FINISHED"
            await curr_user.save()
            await finishSession(curr_user, curr_user.psid)
      } else {
            await askQuestion(curr_user, "Great! Let's move to next question then.", ques_details)
      }
}
