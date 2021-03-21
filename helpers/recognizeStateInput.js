const Fuse = require('fuse.js')
const GlobalSettings = require('../database/models/GlobalSettings')
module.exports = async (input) => {
      // const statearray = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"]
      // const unionarray=["Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"]
      // console.log(input)
      // const states = [{
      //             name: 'Andhra Pradesh',
      //             synonyms: ['Andhra Pradesh', 'Andhra', 'ap', 'a p']
      //       },
      //       {
      //             name: 'Arunachal Pradesh',
      //             synonyms: ['Arunachal Pradesh', 'Arunachal', 'ap', 'a p']
      //       },
      //       {
      //             name: 'Assam',
      //             synonyms: ['Assam', 'assm']
      //       },
      //       {
      //             name: 'Bihar',
      //             synonyms: ['Bihar']
      //       },
      //       {
      //             name: 'Chhattisgarh',
      //             synonyms: ['Chhattisgarh']
      //       },
      //       {
      //             name: 'Goa',
      //             synonyms: ['Goa']
      //       },
      //       {
      //             name: 'Gujarat',
      //             synonyms: ['Gujarat', 'gujrt']
      //       },
      //       {
      //             name: 'Haryana',
      //             synonyms: ['Haryana', 'haryna']
      //       },
      //
      //       {
      //             name: 'Himachal Pradesh',
      //             synonyms: ['Himachal Pradesh', 'hp', 'h p']
      //       },
      //       {
      //             name: 'Jharkhand',
      //             synonyms: ['Jharkhand']
      //       },
      //       {
      //             name: 'Karnataka',
      //             synonyms: ['Karnataka']
      //       },
      //       {
      //             name: 'Kerala',
      //             synonyms: ['Kerala']
      //       },
      //       {
      //             name: 'Madhya Pradesh',
      //             synonyms: ['Madhya Pradesh', 'm p', 'mp']
      //       },
      //       {
      //             name: 'Maharashtra',
      //             synonyms: ['Maharashtra']
      //       },
      //       {
      //             name: 'Manipur',
      //             synonyms: ['Manipur']
      //       },
      //       {
      //             name: 'Meghalaya',
      //             synonyms: ['Meghalaya']
      //       },
      //       {
      //             name: 'Mizoram',
      //             synonyms: ['Mizoram']
      //       },
      //       {
      //             name: 'Nagaland',
      //             synonyms: ['Nagaland']
      //       },
      //       {
      //             name: 'Odisha',
      //             synonyms: ['Odisha', 'Orissa', 'Udisa']
      //       },
      //       {
      //             name: 'Punjab',
      //             synonyms: ['Punjab']
      //       },
      //       {
      //             name: 'Rajasthan',
      //             synonyms: ['Rajasthan']
      //       },
      //       {
      //             name: 'Sikkim',
      //             synonyms: ['Sikkim']
      //       },
      //       {
      //             name: 'Tamil Nadu',
      //             synonyms: ['Tamil Nadu']
      //       },
      //       {
      //             name: 'Telangana',
      //             synonyms: ['Telangana']
      //       },
      //       {
      //             name: 'Tripura',
      //             synonyms: ['Tripura']
      //       },
      //       {
      //             name: 'Uttar Pradesh',
      //             synonyms: ['Uttar Pradesh']
      //       },
      //       {
      //             name: 'Uttarakhand',
      //             synonyms: ['Uttarakhand']
      //       },
      //       {
      //             name: 'West Bengal',
      //             synonyms: ['West Bengal', 'Bengal']
      //       }
      // ]
      // const unionterittories = [{
      //             name: 'Andaman and Nicobar Islands',
      //             synonyms: ['Andaman and Nicobar Islands', 'andaman', 'nicobar']
      //       },
      //       {
      //             name: 'Chandigarh',
      //             synonyms: ['Chandigarh']
      //       },
      //       {
      //             name: 'Dadra and Nagar Haveli and Daman and Diu',
      //             synonyms: ['Dadra and Nagar Haveli and Daman and Diu', 'daman', 'diu', 'dadra and nagar haveli', 'daman diu']
      //       },
      //       {
      //             name: 'Delhi',
      //             synonyms: ['Delhi', 'ncr', 'dilli']
      //       },
      //       {
      //             name: 'Jammu and Kashmir',
      //             synonyms: ['Jammu and Kashmir', 'jammu', 'kashmir', 'jammu kashmir']
      //       },
      //
      //       {
      //             name: 'Ladakh',
      //             synonyms: ['Ladakh']
      //       },
      //       {
      //             name: 'Lakshadweep',
      //             synonyms: ['Lakshadweep']
      //       },
      //       {
      //             name: 'Puducherry',
      //             synonyms: ['Puducherry', 'Pondicherry']
      //       }
      // ]

      states = await GlobalSettings.findOne().states
      unionterittories = await GlobalSettings.findOne().union_territories

      const options = {
            isCaseSensitive: false,
            threshold: 0.4,
            includeScore: true,
            keys: ["synonyms"]
      }
      const fuse = new Fuse(states.concat(unionterittories), options)

      const results = fuse.search(input)

      var error = null
      var response

      if (results.length == 1)
            response = results[0].item.name
      else if (results.length > 1) {
            var till_i = results.length - 1
            for (var i = 0; i < results.length - 1; i++) {
                  if ((results[i + 1].score - results[i].score) > 0.1 || (results[i + 1].score - results[i].score) / results[i + 1].score > 0.90) {
                        till_i = i
                        break;
                  }
            }
            if (till_i == 0)
                  response = results[0].item.name
            else {
                  var error = "Do you mean one of the following: \n"
                  for (var i = 0; i < till_i + 1; i++)
                  error += results[i].item.name + "\n"
            }
      } else
            error =  "Enter full name of your state/union territory."
      return [response,error]
}
