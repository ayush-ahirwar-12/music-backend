var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey   : process.env.PUBLIC_KEY,
    privateKey  : process.env.PRIVATE_KEY,
    urlEndpoint : process.env.URL_ENDPOINT
});

function uploadFile(file,fileName){
    const result = imagekit.upload({
        file,
        fileName,
        folder:"music-14"
    })
    return result;
}

module.exports=uploadFile;