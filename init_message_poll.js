// Fetch feed module
var TwitterPoll = require('./lib/twitter' );
var Parser = require('./lib/parser' );

var tpoll = new TwitterPoll();

var CommandProcessor = require('./lib/command_processor');

tpoll.on( 'mentions', function ( data ) {
    console.log( typeof(data) );
    
    var data = JSON.parse(data),
    cmdMap;

    if (Array.isArray(data)) 
        cmdMap = data.map(function (v, index, arr) {
            return Parser.parse(v);
        });
        
    
    setTimeout(function() {
        CommandProcessor.processCommand(cmdMap);
    }, 0);
    
} );

tpoll.on( 'directMessages', function ( data ) {
    console.log( data );
} );

tpoll.directMessages().mentions();