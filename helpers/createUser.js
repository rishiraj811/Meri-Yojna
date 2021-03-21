const getUserProfile = require('../facebook/getUserProfile');
const User = require('../database/models/User')
module.exports = async (sender_psid) => {
     const userinfo = await getUserProfile(sender_psid)
     var newuser = new User({
          psid: userinfo.data["id"],
          fb_personal_info: userinfo.data,
     })
     newuser["curr_state"] = "NEW_SESSION"
     return await newuser.save()
}
