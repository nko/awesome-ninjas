// App

var express = require("express")
var sys = require("sys");
var Redis = require("./redis");

var app = express.createServer()

app.configure(function(){
    app.set('views', __dirname + '/views')
    app.set('view engine', 'ejs')
    app.use(express.logger())
    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
    app.use(express.staticProvider( __dirname + '/../public' ));
});

app.get('/', function(req, res){
    res.render('index', {
        locals: { title: 'Awesome Ninjas' }
    })
})

app.get('/:id', function(req, res){
    var db = Redis.getDb();
    db.get(req.params.id, function(err, data) {
        if (err) {
        }
        
        data = JSON.parse(data);
        console.log(data.command);
        res.render('show', {
            locals: { title: 'Your Map Results', object: data, showMap: true }
        })
        db.close();
    });
})

exports.run = function() {
    app.listen(parseInt(process.env.PORT) || 8000)
    sys.log("App started on PORT: 8000")
}
