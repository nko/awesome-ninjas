// require redis

// initialize redis
var Redis = require( './redis' );
var Db = module.exports = {};

Db.store = function (key, value) {
    console.log("came here..");
    var db = Redis.getDb();
    db.set(key, value);
    db.close();
}

Db.fetch = function(key) {
    var db = Redis.getDb();
    db.get(key, function(err, value) {
        return value;
    });
}


// test purpose
Db.store("foo", "sports");

//var result = Db.fetch("foo");
//console.log(result);

// db.set("foo", 1)
// db.get("foo", function(err, value) { sys.puts(value); });
// db.randomkey(function(err, key) { sys.puts(key); });
// db.hset("bar", "hi", "world");
// db.hget("bar", "hi", function(err, value) { sys.puts(value); });
// db.hgetall("bar", function(err, data) { sys.puts(data["hi"]); });
// db.set("foo", 1)