'use strict';

var bodyParser = require('body-parser');
var loopback = require('loopback');
var boot = require('loopback-boot');
var frameguard = require('frameguard');

var app = module.exports = loopback();

var port = process.env.PORT;
var deployPath = process.env.deployPath || "";

app.middleware('initial', bodyParser.urlencoded({ extended: true }));
app.all('/api/*', function(req, res, next){
  req.setTimeout(0); // this is the statement and pass it to the next middle ware func.
  next();
});

app.middleware('parse',loopback.token());

app.use(frameguard({
  action: 'allow-from',
  domain: 'https://ssd.insielmercato.it'
}))

const parseArgs = require('minimist') (process.argv.slice(2));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

app.start = function() {
  if (port) {
    app.set('port', port);
  } else {
    console.log('parseArgs.port is not defined. Default port is used');
  }
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
