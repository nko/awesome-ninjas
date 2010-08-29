// Parser

var Parser = module.exports = {};

var CommandMap = require('./command_map');

Parser.parse = function ( tweet ) {
    var data = {},
        userRe = /(@\w+)/g,
        commandRe = /^([A-Z]+)/,
        user;

    var commandMap = CommandMap.get();

    // ignore if a retweet
    if( tweet.text.indexOf('RT') > -1 ) return;

    // get the tweet text
    data.text  = tweet.text;
    data.msgId = tweet.id; 
    // user object
    user = tweet.sender || tweet.user;

    if ( userRe.test( data.text ) ) {
        data.text = data.text.replace( userRe, "" ).trim();
    }

    // if not a valid tweet then return
    //if( !commandRe.test( data.text ) )
    //    return;

    data.command = commandRe.exec( data.text )[0];
    data.search_command = commandMap[data.command] || data.command
    data.address = data.text.substring( commandRe.lastIndex + data.command.length + 1 ).trim();
    data.userId  = user.id
    data.screen_name = user.screen_name;
    data.geo     = tweet.geo !== null;
    data.coords  = user.coordinates;
    
    return data;
}