const axios = require ('axios');
module.exports = async(psid) => {
     const url = 'https://graph.facebook.com/'+psid+'?fields=first_name,last_name,profile_pic,gender&access_token='+ process.env.PAGE_ACCESS_TOKEN;
     const info = await axios.get(url)
     return info
};
