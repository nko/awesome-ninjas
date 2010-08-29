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

    if( Array.isArray( data ) && data )
        map = data.map( function ( tweet ) {
            return CommandParser.parse( tweet );
        } );

    console.log( map );

    // execute asynchronously
    setTimeout( CommandProcessor.process, 0, map, function ( ob ) {
        T.updateStatus( ob );
    } );
}


// subscribe to Twitter message events
T.on( 'mentions', function ( data ) {
    console.log('Mention Message received %s', new Date() );
    twitterCallback( data );
} );
T.on( 'directMessages', function ( data ) {
    console.log('Direct Message received %s', new Date() );
    twitterCallback( data );
} );

T.on( 'error', function (err, res) {
    console.log( err );
    console.log( res );
} );


function startFetch () {
    // fetch messages
    T.mentions().directMessages();    
}

// start polling
timeout = setInterval( startFetch, 5000 );

process.on( 'exit', function () {
    clearInterval( timeout );
    console.log('Exit...by');
} );


console.log('Message poll has started on %s', new Date() );
