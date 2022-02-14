const mongoose = require('mongoose');


let studentScheme = new mongoose.Schema({
    name : String,
    age : String,
    sapId : String,
    rollNo : String,
    email : String,
    contactno : String,
    status : String,
    companyName : String,
    companyUrl : String,
    package : String
});


module.exports = mongoose.model('Student', studentScheme);