// add the vendored express to the require path
require.paths.unshift("vendor/ejs/lib")
require.paths.unshift("vendor/connect/lib")
require.paths.unshift("vendor/express/lib")

var app = require("./lib/app");

app.run();


// initialize twitter message poll
//require( './init_message_poll' );