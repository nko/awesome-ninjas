// Command Processor


// require redis
var Redis = require('./redis'),
    Twitter = require('./twitter'),
    CommandProcessor = module.exports = {};

const APP_URL = 'http://nko-awesome-ninjas.heroku.com/';

CommandProcessor.process = function ( commands, callback ) {
    var db = Redis.getDb();

    function getTweetURL( key ) {
        return APP_URL + key;
    }

    commands.forEach( function ( cmd ) {
        if( !cmd ) return;

        // create a unique identifier which will act as our key
        var key = cmd.msgId.toString( 36 ), url;
        // store in DB
        db.set( key, JSON.stringify(cmd) );

        url = getTweetURL( key );

        callback( {
            status: '@' + cmd.screen_name + ' ' + url, 
            in_reply_to_status_id: cmd.msgId
        } );        
    } );
    
}