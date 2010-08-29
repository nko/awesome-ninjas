var Twitter          = require('./lib/twitter' ),
    CommandProcessor = require('./lib/command_processor'),
    CommandParser    = require('./lib/parser'),
    Redis = require('./lib/redis'),

    // twitter communication instance
    T                = new Twitter(),
    timeout, db;


// twitter message callback
// parses the JSON encoded messages and then converts them
// to commands to executed by CommandProcessor
function twitterCallback( data ) {
    var map=[], l, r;

    if( Array.isArray( data ) && data ) {
        l = data.length;
        while(--l >= 0) {
            r = CommandParser.parse( data[l] );
            if( r )
                map.push( r );
        }
    }
    // execute asynchronously
    setTimeout( CommandProcessor.process, 0, map, function (ob) {
        T.updateStatus(ob);
    } );
}


// subscribe to Twitter message events
T.on( 'mentions', function ( data ) {
    console.log('Mention Message received %s', new Date() );
    T.setMentionSinceId(data[0].id);
    twitterCallback( data );
} );

T.on( 'updateStatus', function ( data ) {
    db = Redis.getDb();
    db.set( 'mention_since_id', data[0].id, function() {
        db.close();
    });
} );

T.on( 'error', function (err, res) {
    console.log( err );
    console.log( res );
} );


db = Redis.getDb();
db.get("mention_since_id", function(err, val){
    T.setMentionSinceId(val);
    // start polling
    timeout = setInterval(function() {
        T.mentions();    
    }, 5000 );

    db.close();
});


process.on( 'exit', function () {
    clearInterval( timeout );
    console.log('Exit...by');
} );


console.log('Message poll has started on %s', new Date() );
