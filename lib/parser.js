function Parser(tweet) {

    var data = JSON.parse(tweet);
    var text = data.text;

    function parseText(text) {
        var regEx = /(@\w+)/g;
        
        if (regEx.test(text)) {
            text = text.replace(regEx, "").trim();
        }
        
        var splitText = text.split(",");
        var cmd = splitText[0];
        var address = splitText.shift().join(",");
        
        return [cmd, address];
    }

    var info = parseText(text);

    var userId = data.sender ? data.sender_id : data.user.id;

    var cmd = new Command();
    
    cmd.userId = userId;
    cmd.command = info[0];
    cmd.address = info[1];
    cmd.geo = data.geo !== null;
    cmd.coords = if data.sender ? "" :  data.coordinates;
    
    return cmd;
}

exports = new Parser();


function Command() {
    
    this.command = null;
    this.userId = null;
    this.coords = null;
    this.address = "";
    this.geo = null;
}