var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

var app = express();
global.config = require('./config.js');

app.configure(function(){
  app.set('port', config.port || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('*', function(req, res) {
	var url = req.headers['x-original-url'].split('/');
	url = url.filter(function(n){ return n !== ''; });
	if ( url.length >= 1 ) {
		if (url[0] == 'report') {
			var report = require('./objects/report.js');
			if (url[1] == 'mail') {
				report.mail(req, res, url[2]);
			}
			else if (url[1] == 'order4customer' || url[1] == 'order4office' || url[1] == 'envelope') {
				report.generate(req, res, url[1], url[2], url[3]);
			}
			else if (url[1] == 'dealer') {
				report.dealer(req, res, url[2], url[3].replace('.pdf', ''));
			}
			else {
				report.action(req, res, url[1], url[2]);
			}
		}
		else if (url[0] == 'barcode') {
			var barcode = require('./objects/barcode.js');
			barcode.generate(req, res, url[1]);
		}
		else if (url[0] == 'test') {
			var test = require('./objects/test.js');
			test.action(req, res);
		}
		else {
			fs.exists('./views/'+url[0]+'.jade', function (exists) {
				if (exists) {
					fs.exists('./public/javascripts/'+url[0]+'.js', function (exists) {
						routes.index(req, res, url[0], (exists) ? '/javascripts/'+url[0]+'.js' : '' );
					});
				}
				else {
					routes.index(req, res, 'index', '');
				}
			});
		}
	}
	else {
		routes.index(req, res, 'index', '');
	}
});

app.post('*', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	global.data = {};
	data.result = null;
	data.success = false;
	data.error = 'No Action';

	var url = req.headers['referer'].split('/');
	if (config.origin.indexOf(url[2]) > -1) {		

		url = req.headers['x-original-url'].split('/');
		url = url.filter(function(n){ return n !== ''; });
		if ( url.length >= 2 ) {
			var control = url[0];
			var action = url[1];
			url[0] = null;
			url[1] = null;
			url = url.filter(function(n){ return n !== null; });
			fs.exists('./objects/'+control+'.js', function (exists) {
				if (exists) {
					var object = require('./objects/'+control);
					object.action(req, res, object, action, url);
				}
				else {
					res.json(data);
				}
			});
		}
	}
	else {
		data.error = 'Your site do not allow access to this resource';
		res.json(data);
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
