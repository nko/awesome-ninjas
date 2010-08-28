var Redis = module.exports = {};

Redis.getDb = function ( ) {
    var sys = require('sys');
    var redis = require("../vendor/redis-node-client/lib/redis-client");
    var db = redis.createClient(9272, 'goosefish.redistogo.com');
    var dbAuth = function() { db.auth('399b9fcf4cbd80b7194fe76bb70e00fc'); }
    db.addListener('connected', dbAuth);
    db.addListener('reconnected', dbAuth);

    dbAuth();

    // db.info(function (err, info) {
    //     if (err) throw new Error(err);
    //     sys.puts("Redis Version is: " + info.redis_version);
    //     db.close();
    // });

    return db;
}