var mongoose = require('mongoose');

var GlobalSettingsSchema = new mongoose.Schema({
      configuration : {type:mongoose.Schema.Types.ObjectId, ref: 'Configuration'},
      about_us : String
})

module.exports = mongoose.model('GlobalSettings', GlobalSettingsSchema, 'GlobalSettings')
