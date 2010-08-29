// Twitter

var http         = require('http'),
    query        = require('querystring'),
    //Parser       = require('./parser'),
    EventEmitter = require('events').EventEmitter,
    OAuth = require('./../vendor/node-oauth/lib/oauth').OAuth;



// CONSTANTS
const OAUTH_ACCESS_KEY = 'Qyh75skaVfaUIjRNYxluw';
const OAUTH_SECRET     = 'rUnr1gvHXLUlHcHvFbieazIO1wApF291eZGudMKBM';

const OAUTH_TOKEN        = '181109840-v81EANFF7BQME1B3thPE43iHLjs9PY3Z7ywdZes8';
const OAUTH_TOKEN_SECRET = '1NzWBrOFJ4Jk0ipXvSMtkYh8hVAKEpOC5whgZ3BPSSY';


function Twitter ( options ) {
    EventEmitter.call( this );

    if( !options )
        options = {};

    this.twitterAPI   = 'http://api.twitter.com/';
    // poll duration
    this.duration     = options.duration || 2000;
    this.twApiVersion = options.twApiVersion || '1';
    this.directMsgApi = options.directMsgApi || '/direct_messages';
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

Twitter.prototype.directMessages = function () {
    var url = this.getURL( this.directMsgApi ),
        self = this;

    if( this.dm_since_id )
        url += ( url.indexOf( '?' ) > -1 ? '&' : '?' ) + 'since_id=' + encodeURIComponent( this.dm_since_id );

    //console.log( 'DM URL : %s', url );
    this.oauth.get( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'error', err, response );

        data = self.parse( data );

        // invoke listeners and pass the data
        if( data && data.length > 0 ) {
            self.emit( 'directMessages', data );
            // store the track of last msg ID received
            self.dm_since_id = data[0].id;
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

// method to send direct message
Twitter.prototype.sendMessage = function ( ob ) {
    var url  = this.getURL( '/direct_messages/new' ),
        self = this,
        postBody = query.stringify( ob );

    this.oauth.post( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, postBody, function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'error', err, response );

        // invoke listeners and pass the data
        self.emit( 'sendMessage', data );
    } );
}

module.exports = Twitter;