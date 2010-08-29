// Twitter

var http         = require('http'),
    query        = require('querystring'),
    EventEmitter = require('events').EventEmitter,
    OAuth = require('./../vendor/node-oauth/lib/oauth').OAuth;



// CONSTANTS
const OAUTH_ACCESS_KEY = '8xYmxtdecgD8wiE2zW3HQ';
const OAUTH_SECRET     = 'f6VBroV2Izki7HhreVdUL7KwKPVpQTitwhwQPTeZY';

const OAUTH_TOKEN        = '184327231-6uZnZO1NuJHuML7PuO4wjcpXgoTTt7cxkBYSdlfR';
const OAUTH_TOKEN_SECRET = 'UyWN0PdEkoQqG13muY11suA2qsIqckbjmKZCh9cHk8';


function Twitter ( options ) {
    EventEmitter.call( this );

    if( !options )
        options = {};

    this.twitterAPI   = 'http://api.twitter.com/';
    // poll duration
    this.duration     = options.duration || 2000;
    this.twApiVersion = options.twApiVersion || '1';
    this.replyMsgApi  = options.replyMsgApi || '/statuses/mentions';    
    this.format       = options.format || 'json';


    // oauth related constants

    this.oauth        = new OAuth("https://api.twitter.com/oauth/request_token",
                            "https://api.twitter.com/oauth/access_token", OAUTH_ACCESS_KEY, OAUTH_SECRET,
                            "1.0", null, "HMAC-SHA1");


}

// extend the poll to with the EventEmitter
Twitter.prototype = Object.create( EventEmitter.prototype );

Twitter.prototype.getURL = function ( method ) {
    var parts = [
        this.twitterAPI,
        this.twApiVersion,
        method,
        '.',
        this.format  ];
    
    return parts.join('');
}

Twitter.prototype.parse = function ( data ) {
    try {
        data = JSON.parse( data );
    }catch( e ) {
        data = null; // invalid JSON don't proceed
    }

    return data;
}

Twitter.prototype.setMentionSinceId = function(id) {
    this.mention_since_id = id;
}

Twitter.prototype.mentions = function () {
    var url = this.getURL( this.replyMsgApi ),
        self = this;

    if( this.mention_since_id )
        url += ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + 'since_id=' + encodeURIComponent( this.mention_since_id );
    
    console.log( 'Mentions URL : %s', url );
    this.oauth.get( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'error', err, response );

        data = self.parse( data );

        // invoke listeners and pass the data
        if( data && data.length > 0 ) {
            self.emit( 'mentions', data );
        }


    } );

    return this;
}

// method to follow a user
// one parameter has to be present either userId or screenName
Twitter.prototype.follow = function ( userId, screenName ) {
    var params = { follow: true }, url, self = this;

    if( userId )
        params.user_id = userId;

    if( screen_name )
        params.screen_name = screenName;

    url = this.getURL( '/friendships/create' );

    this.oauth.post( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, query.stringify( params ), function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'error', err, response );

        // invoke listeners and pass the data
        self.emit( 'follow', data );
    } );
}

// method to update status to twitter in reply
// ob { status: 'status text...', in_reply_to_user_id: id }
Twitter.prototype.updateStatus = function ( ob ) {
    var url  = this.getURL( '/statuses/update' ),
        self = this;

    //console.log('Status = %s \n\n%s', url, query.unescape(postBody) )
    this.oauth.post( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, ob, function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'updateStatus', [{id: ob.in_reply_to_status_id }]);

        data = self.parse( data );

        // invoke listeners and pass the data
        if( data && data.length > 0 ) {
            self.emit( 'updateStatus', data );
        }

    } );    
}

module.exports = Twitter;