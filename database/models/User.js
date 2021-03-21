var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
      psid: Number,
      curr_state: String,
      last_input: {
            configuration: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            sector: String,
            question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            answer: String
      },
      messages: [{
            _id: false,
            time: String,
            from: {
                  type: String,
                  enum: ["chatbot", "user"]
            },
            message: String
      }],
      fb_personal_info: {
            first_name: String,
            last_name: String,
            profile_pic: String,
            gender: String
      },
      personal_info: [{
            _id: false,
            question:{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            answer:mongoose.Schema.Types.Mixed
      }]

}, {
      versionKey: false, // You should be aware of the outcome after set to false
      minimize: false
});

module.exports = mongoose.model('User', UserSchema, 'Users')
