module.exports = async (timestamp) => {
     var conversion = new Date(timestamp)
     var year = conversion.getFullYear()
     var month = conversion.getMonth()
     var day = conversion.getDate();
     var hours = conversion.getHours();
     var minutes = "0" + conversion.getMinutes();
     var seconds = "0" + conversion.getSeconds();
     return (day + "/" + (month + 1) + "/" + year + " " + hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2))
}
