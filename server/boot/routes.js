'use strict';

module.exports = function(app) {
 

	// Install a "/ping" route that returns "pong"
	app.get('/api/ping', function(req, res) {
		res.send('pong');
	});

	app.get('/api/failure', function(req, res) {
	    res.sendStatus(401);
	});

	app.get('/api/time', function(req, res) {
	    res.send(new Date());
	});

  
};

