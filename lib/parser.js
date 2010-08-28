
var Parser = module.exports = {};


Parser.parse = function ( tweet ) {
    var data = {},
        regEx = /(@\w+)/g;

    // get the tweet text
    data.text = tweet.text;

    if (regEx.test(text)) {
        text = text.replace(regEx, "").trim();
    }

    var splitText = text.split(",");
    var cmd = splitText[0];
    var address = splitText.shift().join(",");

    var userId = data.sender ? data.sender_id : data.user.id;

    var cmd = new Command();
    
    cmd.userId = userId;
    cmd.command = cmd;
    cmd.address = address;
    cmd.geo = data.geo !== null;
    cmd.coords = data.sender ? "" :  data.coordinates;
    
    return cmd;
}


function Command() {
    
    this.command = null;
    this.userId = null;
    this.coords = null;
    this.address = "";
    this.geo = null;
}