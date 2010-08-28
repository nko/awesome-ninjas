var http         = require('http'),
    query        = require('querystring'),
    //Parser       = require('./parser'),
    EventEmitter = require('events').EventEmitter,
    OAuth = require('./../deps/node-oauth/lib/oauth').OAuth;



// CONSTANTS
const OAUTH_ACCESS_KEY = 'Qyh75skaVfaUIjRNYxluw';
const OAUTH_SECRET     = 'rUnr1gvHXLUlHcHvFbieazIO1wApF291eZGudMKBM';

const OAUTH_TOKEN        = '181109840-v81EANFF7BQME1B3thPE43iHLjs9PY3Z7ywdZes8';
const OAUTH_TOKEN_SECRET = '1NzWBrOFJ4Jk0ipXvSMtkYh8hVAKEpOC5whgZ3BPSSY';


function TwitterPoll ( options ) {
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
TwitterPoll.prototype = Object.create( EventEmitter.prototype );

TwitterPoll.prototype.getURL = function ( method ) {
    var parts = [
        this.twitterAPI,
        this.twApiVersion,
        method,
        '.',
        this.format  ];
    
    return parts.join('');
}


TwitterPoll.prototype.mentions = function () {
    var url = this.getURL( this.replyMsgApi ),
        self = this;

    console.log( 'Mentions URL : %s', url );
    this.oauth.get( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'error', err, response );

        // invoke listeners and pass the data
        self.emit( 'mentions', data );
    } );

    return this;
}

TwitterPoll.prototype.directMessages = function () {
    var url = this.getURL( this.directMsgApi ),
        self = this;

    console.log( 'DM URL : %s', url );
    this.oauth.get( url, OAUTH_TOKEN, OAUTH_TOKEN_SECRET, function ( err, data, response ) {
        // handle error
        if( err )
            self.emit( 'error', err, response );

        // invoke listeners and pass the data
        self.emit( 'directMessages', data );
    } );

    return this;
}

module.exports = TwitterPoll;