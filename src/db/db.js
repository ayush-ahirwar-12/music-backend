const mongoose = require("mongoose")
function connecdb(){
    mongoose.connect(process.env.MONGOOSE_URI).then(()=>{
        console.log("database connected");
        
    })
}
module.exports=connecdb