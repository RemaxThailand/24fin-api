var sql = require('mssql');
var config = require('../config.js');

exports.getUrl = function(req, res, control, action, url) {
	var http = require( (url.substr(0,5) == 'https') ? 'https' : 'http' );

	http.get(url, function(response) {
		response.setEncoding('utf8');
		var recordset = '';
		response.on('error', function (e) {
			control.process(req, res, action, e.message);
		});
		response.on('data', function (chunk) {
			recordset += chunk;
		});
		response.on('end', function (chunk) {
			control.process(req, res, action, recordset);
		});
	});

}

exports.postUrl = function(req, res, control, action, path, postString) {
	var http = require( (url.substr(0,5) == 'https') ? 'https' : 'http' );

	var options = {
		host: config.apiPostUrl,
		path: path,
		method: 'POST',
		headers: {
			referer: config.refererUrl,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postString.length
		}
	};

	var postReq = http.request(options, function(response) {
		response.setEncoding('utf8');
		var recordset = '';
		response.on('data', function (chunk) {
			recordset += chunk;
		});
		response.on('end', function (chunk) {
			control.process(req, res, action, recordset);
		});
	});

	postReq.write(postString);
	postReq.end();

}

exports.query = function(req, res, control, action, command){
	var connection = new sql.Connection(config.mssql, function (err) {
		var request = new sql.Request(connection);
		//request.multiple = true;
		request.query(command, function (err, recordset, returnValue) {
			if (!err){
				control.process(req, res, action, recordset);
			}else{
			   control.error(req, res, action, err.message);
			}
		});
	 });
};

exports.queryNull = function(command){
	var connection = new sql.Connection(config.mssql, function (err) {
		var request = new sql.Request(connection);
		request.query(command, function (err, recordset, returnValue) {
		});
	 });
};

exports.queryMultiple = function(req, res, control, action, command){
	var connection = new sql.Connection(config.mssql, function (err) {
		var request = new sql.Request(connection);
		request.multiple = true;
		request.query(command, function (err, recordset, returnValue) {
			if (!err){
				control.process(req, res, action, recordset);
			}else{
			   control.error(req, res, action, err.message);
			}
		});
	 });
};

exports.batch = function(req, res, control, action, command){
	var connection = new sql.Connection(config.mssql, function (err) {
		var request = new sql.Request(connection);
		//request.multiple = true;
		request.batch(command, function (err, recordset, returnValue) {
			if (!err){
				control.process(req, res, action, recordset);
			}else{
			   control.error(req, res, action, err.message);
			}
		});
	 });
};

exports.batchJob = function(req, res, command){
	var connection = new sql.Connection(config.mssql, function (err) {
		var request = new sql.Request(connection);
		request.multiple = true;
		request.batch(command, function (err, recordset, returnValue) {
			if (!err){
				data.success = true;
				delete data.error;
				res.json(data);
			}else{
				data.error = err.message;
				res.json(data);
			}
		});
	 });
};

exports.encrypt = function(text, password) {
	var crypto = require('crypto');
	var cipher = crypto.createCipher(config.crypto.algorithm, password);
	return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

exports.decrypt = function(encrypted, password) {
	var crypto = require('crypto');
	var decipher = crypto.createDecipher(config.crypto.algorithm, password);
	return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

exports.getImage = function(req, res) {
	var azure = require('azure-storage');
	var blobService = azure.createBlobService();
	var stream;
	blobService.getBlobToStream('img', '2.jpg', res, function(error){
		if (error) {
			//throw error;
			res.end();
		}
		else {
			res.writeHead(200, {'Content-Type': 'image/png'});
            res.end();
		}
		//res.json(data);
	});
}