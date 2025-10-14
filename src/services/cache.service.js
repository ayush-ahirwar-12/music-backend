const redis = require("ioredis")

const cacheClient = new redis({
    host:process.env.HOST,
    port:process.env.PORT,
    password:process.env.PASSWORD
})

module.exports=cacheClient