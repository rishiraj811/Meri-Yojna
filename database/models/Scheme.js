var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchemeSchema = new Schema({
      scheme_name: String,
      criteria: [[{
            _id:false,
            question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            matching: {
                  type:String,
                  enum:['MIN_MAX','EQUALS','INCLUDE_EXCLUDE','RANGE_DATE','RANGE_YEAR','STATE']
            },
            value: mongoose.Schema.Types.Mixed
      }]]
}, {
      versionKey: false, // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('Scheme', SchemeSchema, 'Schemes')
