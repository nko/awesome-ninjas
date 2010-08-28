// Parser

var Parser = module.exports = {};

var sys = require('sys');


Parser.parse = function ( tweet ) {
    var data = {},
    regEx = /(@\w+)/g,
    text = "";

    // get the tweet text
    data.text = tweet.text;

    if (regEx.test(data.text)) {
        text = text.replace(regEx, "").trim();
    }

    var splitText = text.split(",");
    var cmd = splitText[0];
    splitText.shift();
    var address = splitText.join(",");

    var userId = tweet.sender ? tweet.sender_id : tweet.user.id;

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
