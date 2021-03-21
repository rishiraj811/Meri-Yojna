const mongoose = require('mongoose')
module.exports = async () => {
     await mongoose.connect(process.env.DATABASE_URL+"AbhishekTrialDatabase", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex:true
     }).then(() => {
          console.log("Successfully connected to the database!")
     }).catch(err => {
          console.log('Could not connect to the database.', err);
          process.exit();
     })
}
