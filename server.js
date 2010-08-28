// Fetch feed module


/*var sys= require('sys')

var OAuth= require('./deps/node-oauth/lib/oauth').OAuth;

var oa= new OAuth("https://api.twitter.com/oauth/request_token",
                  "https://api.twitterx`.com/oauth/access_token",
                  "Qyh75skaVfaUIjRNYxluw",
                  "rUnr1gvHXLUlHcHvFbieazIO1wApF291eZGudMKBM",
                  "1.0",
                  null,
                  "HMAC-SHA1")


oa.get("http://api.twitter.com/1/statuses/mentions.json", "181109840-v81EANFF7BQME1B3thPE43iHLjs9PY3Z7ywdZes8", "1NzWBrOFJ4Jk0ipXvSMtkYh8hVAKEpOC5whgZ3BPSSY", function(error, data, response) {

    sys.puts(sys.inspect(data));
});*/


var TwitterPoll = require('./lib/poll' );

var tpoll = new TwitterPoll();

tpoll.on( 'mentions', function ( data ) {
    console.log( data );    
} );

tpoll.on( 'directMessages', function ( data ) {
    console.log( data );
} );

tpoll.directMessages().mentions();

// Parse feed module


// Process feed module


// Send processed results to user back

