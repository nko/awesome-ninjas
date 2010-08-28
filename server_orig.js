// Fetch feed module
var TwitterPoll = require('./lib/twitter' );

var tpoll = new TwitterPoll();

var CommandProcessor = require('./lib/command_processor');

tpoll.on( 'mentions', function ( data ) {
    console.log( typeof(data) );
    
    var data = JSON.parse(data),
    cmdMap;

    if (Array.isArray(data)) 
        cmdMap = data.map(function (v, index, arr) {
            return Parser(v);
        });
        
    
    setTimeout(function() {
        CommandProcesor.process(cmdMap);
    }, 0);
    
} );

tpoll.on( 'directMessages', function ( data ) {
    console.log( data );
} );

tpoll.directMessages().mentions();



// Parse feed module


// Process feed module


// Send processed results to user back

