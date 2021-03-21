var mongoose = require('mongoose');

var ConfigurationSchema = new mongoose.Schema({
      name : {
            type: String,
            required: true,
            unique: true
      },
      general_questions : [{
            _id:false,
            question:{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            position:Number
      }],
      sectors : [{
            name: String,
            questions:[{
                  ques_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
                  position:Number
            }],
            schemes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }]
      }],
})

module.exports = mongoose.model('Configuration', ConfigurationSchema, 'Configurations')
