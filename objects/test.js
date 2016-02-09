exports.action = function(req, res) {

	try {
		var azure = require('azure-storage');
		var retryOperations = new azure.ExponentialRetryPolicyFilter();
		var blobSvc = azure.createBlobService().withFilter(retryOperations);
		blobSvc.listBlobsSegmentedWithPrefix('img', 'products/D1500021', null, function(error, result, response){
			if(error){
				res.send(error);
			}
			else {
				var img = [];
				for(i=0; i<result.entries.length; i++) {
					img.push(result.entries[i].name.replace('products/D1500021/', ''));
				}
				res.json(img);
			}
		});

		/*var tableSvc = azure.createTableService();
		tableSvc.createTableIfNotExists('shop', function(error, result, response){
			if(error){
				res.send(error);
			}
			else {
				res.send('OK');
			}
		});*/
		/*var tableService = azure.createTableService();
		var query = new azure.TableQuery()
					.where('PartitionKey eq ?', 'Remax');

		tableService.queryEntities('shop', query, null, function(error, result, response) {
			if(error){
				res.send('E1:'+error);
			}
			else {
				//for(i=0; i<result.entries.length; i++) {
					res.send(result.entries[1].Name['_']);
				//}
			}
		});*/
	}
	catch(err) {
		res.send('E2:'+err);
	}

};

/*
exports.action = function(req, res) {

	try {
		//getResponseImagePath(req, res, 'https://www.dropbox.com/s/qjsku96d46hijuy/31981.jpg?raw=1');
		var PDFDocument = require('pdfkit');
		var moment = require('moment');
		var doc = new PDFDocument({margin: 10});

		var d = new Date();
		var m = moment(d);
		m.lang('th');
		m.add(3600*7, 'seconds'); // GMT +7

		//doc.addPage();
		doc.font('./fonts/CALIBRI.TTF', 24)
			.text('Stock Aging Report', 10, 50)
			.font('./fonts/TAHOMA.TTF', 12)
			.text(m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'), 400, 50)
		doc.pipe( res );
		doc.end();
	}
	catch(err) {
		data.err = err;
		res.json(data);
	}

};
*/

function getResponseImagePath(req, res, url){	
	var http = require('https');
	http.get(url, function(response) {
		var html = '';
		response.setEncoding('binary');
		response.on('error', function (e) {
			throw e
		});
		response.on('data', function (chunk) {
			html += chunk;
		});
		response.on('end', function (chunk) {
			var sp = html.split('The resource was found at');
			sp = sp[1].split(';');
			downloadImage(req, res, sp[0].trim())
		});
	});
}

function downloadImage(req, res, url){
	var http = require('https');
	var fs = require('fs');
	http.get(url, function(response) {
		var image = '';
		response.setEncoding('binary');
		response.on('error', function (e) {
			throw e;
		});
		response.on('data', function (chunk) {
			image += chunk;
		});
		response.on('end', function (chunk) {
			var fs = require('fs');
			fs.writeFile('2.jpg', image, 'binary', function(err){
				if (err) throw err;
				var azure = require('azure-storage');
				var blobService = azure.createBlobService();
				blobService.createBlockBlobFromLocalFile('img', '2.jpg', '2.jpg', function(error, result, response){
					if (error) {
						throw error;
						data.error = error;
					}
					else {
						data.success = true;
					}
					res.json(data);
				});
				
			});
		});

	});
}