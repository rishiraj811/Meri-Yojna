async function main() {
      //setting main app variables
      const
            express = require("express"),
            bodyParser = require("body-parser"),
            app = express().use(bodyParser.json()).use(require ('cors')()),
            port = (process.env.PORT);
      const
            webhookVerification = require('./facebook/webhookVerification'),
            messageWebhook = require('./facebook/messageWebhook'),
            mongodbConnect = require('./database/mongodbConnect'),
            setPersistentMenu = require('./facebook/setPersistentMenu'),
            setGetStartedButton = require('./facebook/setGetStartedButton');

      const
            User = require('./database/models/User'),
            Question = require('./database/models/Question'),
            CRUD = require('./database/CRUD.js');

      //connected to database
      await mongodbConnect();

      // setting persistentMenu and getStarted
      // await setGetStartedButton()
      // await setPersistentMenu()

      //started the server
      app.listen(port, () => console.log('Webhook is listening on ' + port));

      //main webpage
      app.get('/', function(req, res) {
            res.send('<p style="font-family:Helvetica"><em>© Rishi Raj Singh 2020</em></p>')
      })

      //facebook webhook requests
      app.get('/webhook', webhookVerification);
      app.post('/webhook', messageWebhook);

      //database update
      app.use('/api',CRUD)
}
main()
