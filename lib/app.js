// App

var express = require("express")
var sys = require("sys");

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
  res.render('show', {
    locals: { title: 'Your Map Results', objectId: req.params.id, showMap: true }
  })
})

exports.run = function() {
  app.listen(parseInt(process.env.PORT) || 8000)
  sys.log("App started on PORT: 8000")
}
