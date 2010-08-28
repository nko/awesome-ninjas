var Twitter          = require('./lib/twitter' ),
    CommandProcessor = require('./lib/command_processor'),
    CommandParser    = require('./lib/parser'),

    // twitter communication instance
    T                = new Twitter(),
    timeout;


// twitter message callback
// parses the JSON encoded messages and then converts them
// to commands to executed by CommandProcessor
function twitterCallback( data ) {
    var map;

    try {
        data = JSON.parse( data );
    }catch( e ) {
        return; // invalid JSON don't proceed
    }

    if( Array.isArray( data ) && data )
        map = data.map( function ( tweet ) {
            return CommandParser.parse( tweet );
        } );

    // execute asynchronously
    setTimeout( CommandProcessor.process, 0, map );
}


// subscribe to Twitter message events
T.on( 'mentions', function ( data ) {
    console.log('Message received', new Date() );
    twitterCallback( data );
} );
T.on( 'directMessages', function ( data ) {
    console.log('Message poll has started on %s', new Date() );
    twitterCallback( data );
} );

// call for the first time
T.mentions().directMessages();

// start polling
timeout = setInterval( function () {
    // fetch messages
    T.mentions().directMessages();    
}, 5000 );



process.on( 'exit', function () {
    clearTimeout( timeout );
    console.log('Exit...bye');
} );


console.log('Message poll has started on %s', new Date() );
