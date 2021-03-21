var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
      name: {
            type: String,
            unique: true,
            required: true
      },
      dependencies: [[{
            _id:false,
            question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            matching: {
                  type:String,
                  enum:['MIN_MAX','EQUALS','INCLUDE_EXCLUDE','RANGE_DATE','RANGE_YEAR','STATE']
            },
            value: mongoose.Schema.Types.Mixed
      }]],
      type: {
            required: true,
            type: String,
            enum : ['NORMAL_TEXT','QUICK_REPLY','DATE','NUMBER','STATE','MONEY']
      },
      error_message: {
            type: String,
            required: true
      },
      messenger_response:{
            type: Object,
            required:true,
            text:String,
            quick_reply_options:[String]
      }
}, {
      versionKey: false, // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Question', QuestionSchema, 'Questions')
