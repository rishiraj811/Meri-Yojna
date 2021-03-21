Scheme = require('../database/models/Scheme')
User = require('../database/models/User')
Question = require('../database/models/Question')
module.exports = async(criteria,personal_info) => {
      // for(const property of criteria){
      //       user_info = personal_info.find(personal_info => personal_info.question.equals(property.question))
      //       if(user_info==undefined)
      //             return false
      //       else{
      //             if(property.matching=='MIN_MAX'){
      //                   // for number and money
      //             }
      //             else if (property.matching=='EQUALS'){
      //                   //for number and money
      //             }
      //             else if (property.matching=='INCLUDE_EXCLUDE'){
      //                   //for uick reply //state
      //             }
      //             else if (property.matching=='RANGE_DATE'){
      //                   // for date
      //             }
      //             else if (property.matching=='RANGE_YEAR'){
      //                   // for date
      //             }
      //
      //       }
      //       ['MIN_MAX','EQUALS','INCLUDE_EXCLUDE','RANGE_DATE','RANGE_YEAR','STATE']
      //       ['NORMAL_TEXT','QUICK_REPLY','DATE','NUMBER','STATE','MONEY']
      // }
      // for (const property in criteria) {
      //       if (property=='age') {
      //             if(!await checkMinMaxCriteria(await calculateAge(personal_info.DOB),criteria[property])){
      //                   return false
      //             }
      //       }
      //       else if (property=='family_income') {
      //             if(!await checkMinMaxCriteria(personal_info[property],criteria[property]))
      //                   return false
      //       }
      //       else if (property=='educational_qualification') {
      //             // console.log('Hello')
      //             all_quals=["CLASS_5","CLASS_8","CLASS_10","CLASS_12","GRADUATE"]
      //             if(all_quals.indexOf(criteria[property])>all_quals.indexOf(personal_info[property]))
      //                   return false
      //       }
      //       else {
      //             // console.log('Hello')
      //             if(criteria[property]!=personal_info[property])
      //                   return false
      //       }
      // }
      // return true
}
async function calculateAge(dob) { // birthday is a date
      curr_date=new Date()
      dob=new Date(dob)
      years = curr_date.getFullYear()-dob.getFullYear()
      if(curr_date.getMonth()-dob.getMonth()<0){
            return years-1
      }
      else if (curr_date.getMonth()-dob.getMonth()>0){
            return years
      }
      else{
            if(curr_date.getDate()-dob.getDate()>0)
                  return years-1
            else
            return years
      }
}
async function checkMinMaxCriteria(value,criteria){
      if(criteria.min!=null){
            if(criteria.max!=null)
                  return (value>=criteria.min&&value<=criteria.max)
            else
                  return (value>=criteria.min)
      }
      else{
            if(criteria.max!=null)
                  return (value<=criteria.max)
            else
                  return false
      }
}
