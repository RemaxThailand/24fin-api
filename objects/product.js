var util = require('../objects/util');


exports.action = function(req, res, control, action, url) {

	try {

		if (action == 'all') {
			util.query(req, res, control, 'data', 'EXEC sp_DataProduct \''+req.body.authKey+'\'');
		}
		else if (action == 'category') {
			if (url[0] == 'url') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '' ||
					typeof req.body.url == 'undefined' || req.body.url == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'category_by_url', 'EXEC sp_DataProductByCategoryUrl \''+req.body.shop+'\', \''+req.body.url+'\'');
				}
			}
			else {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataProductGroup \''+req.body.shop+'\'');
				}
			}
		}
		else if (action == 'info') {
			if (url[0] == 'id') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '' ||
					typeof req.body.id == 'undefined' || req.body.id == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'product_info', 'EXEC sp_DataProductById \''+req.body.shop+'\', \''+req.body.id+'\'');
				}
			}
		}
		else if (action == 'brand') {
			if (url[0] == 'update') {
			}
			else {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataBrand \''+req.body.shop+'\'');
				}
			}
		}
		else if (action == 'category_and_brand') {
			if (url[0] == 'update') {
			}
			else {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'category_and_brand', 'EXEC sp_DataProductGroupAndBrand \''+req.body.shop+'\'');
				}
			}
		}
		else if (action == 'sku') {
			if (url[0] == 'active') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataProductSkuActive \''+req.body.shop+'\'');
				}
			}
			else {
			}
		}
		else if (action == 'image') {
			if (url[0] == 'update') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '' ||
					typeof req.body.product == 'undefined' || req.body.product == '' ||
					typeof req.body.path == 'undefined' || req.body.path == '' ||
					typeof req.body.bytes == 'undefined' || req.body.bytes == '' ||
					typeof req.body.modified == 'undefined' || req.body.modified == '' ||
					typeof req.body.modifier == 'undefined' || req.body.modifier == '' ||
					typeof req.body.system == 'undefined' || req.body.system == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else if ( isNaN(req.body.bytes) ) {
					data.error = 'Please fill number of bytes';
					res.json(data);
				}
				else if ( process.env.dropboxAllowSystem.indexOf(req.body.system) == -1 ) {
					data.error = 'Your system do not allow access to use API';
					res.json(data);
				}
				else {
					util.batch(req, res, control, 'success', 'EXEC sp_ImageUpdate \''+req.body.shop+'\', \'product\', \''+req.body.product+'\', \''+req.body.path+'\', \''+req.body.bytes+'\', \''+req.body.mineType+'\', \''+req.body.revision+'\', \''+((req.body.size == '') ? '1N' : req.body.size)+'\', \''+req.body.modified+'\', \''+req.body.modifier+'\', \''+req.body.system+'\'');
				}
			}
			else if (url[0] == 'list') {
				/*var azure = require('azure-storage');
				var retryOperations = new azure.ExponentialRetryPolicyFilter();
				var blobSvc = azure.createBlobService().withFilter(retryOperations);
				blobSvc.listBlobsSegmentedWithPrefix('img', 'products/'+req.body.shop+'/'+req.body.sku, null, function(error, result, response){
					if(error){
						res.send(error);
					}
					else {
						var img = [];
						for(i=0; i<result.entries.length; i++) {
							img.push(result.entries[i].name.replace('products/'+req.body.shop+'/'+req.body.sku+'/', ''));
						}
						data.location = 'https://cdn24fin.blob.core.windows.net/img/products/'+req.body.shop+'/'+req.body.sku+'/';
						data.result = img;
						data.success = true;
						delete data.error;
						res.json(data);
					}
				});*/
				util.query(req, res, control, 'image', 'EXEC sp_DataProductImageList \''+req.body.shop+'\', \''+req.body.sku+'\'');
			}
			else if (url[0] == 'cover') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataProductImage \''+req.body.authKey+'\'');
				}
			}
			else {
			}
		}


		else {
			if (data.success) delete data.error;
			res.json(data);
		}


	}
	catch(err) {
		data.error = err.message;
		data.stack = err.stack;
		res.json(data);
	}

};



exports.process = function(req, res, action, recordset) {
  if (action == 'data') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  data.result = recordset;
	  }
  }
  else if (action == 'image') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
			var sp = recordset[0].image.split(',');
			var img = [];
			for(i=1; i<sp.length; i++) {
				if ( sp[i].toLowerCase().indexOf('d') == -1 )
				img.push(sp[i]);
			}
			data.location = 'https://api.powerdd.com/img/remax/product/'+req.body.sku+'/500/500/';
			data.result = img;
			data.success = true;
			delete data.error;
			res.json(data);
	  }
  }
  else if (action == 'success') {
	  data.success = true;
  }
  else if (action == 'category_by_url') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  data.category = recordset[0][0].name;
		  data.result = recordset[1];
	  }
  }
  else if (action == 'product_info') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  //data.category = recordset[0][0].name;
		  data.result = recordset[0];
	  }
  }
  else if (action == 'category_and_brand') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  var json = [];
		  var cnt = recordset.length;
		  var category = [];
		  var brand = {};
		  for(i=0; i<cnt; i++) {
			  if (category.indexOf(recordset[i].groupId) == -1) {
				  var brandArr = [];
				  json.push({ id: recordset[i].groupId, name: recordset[i].groupName, url: recordset[i].groupUrl, piority: recordset[i].groupPiority });
				  category.push(recordset[i].groupId);
				  brand[recordset[i].groupId] = [];
			  }
			  brand[recordset[i].groupId].push( { id: recordset[i].brandId, name: recordset[i].brandName, piority: recordset[i].brandPriority } );
			  //if (typeof category[recordset[i].groupId != 'undefined')
		  }
		  var newJson = [];
		  for(i=0; i<json.length; i++) {
			  newJson.push({ id: json[i].id, name: json[i].name, url: json[i].url, piority: json[i].piority, brand: brand[json[i].id]  });
		  }
		  data.result = newJson;
		  delete json;
		  delete cnt;
		  delete category;
		  delete brand;
		  delete newJson;
	  }
  }

  if (data.success) delete data.error;
  res.json(data);
}


exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}