var util = require('../objects/util');

exports.action = function(req, res, control, action, url) {

	try {

		if (action == 'info') {
			if (url[0] == 'barcode') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' || typeof req.body.sellNo == 'undefined' || req.body.sellNo == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'dataBarcode', 'EXEC sp_DataShopBarcode \''+req.body.authKey+'\', '+req.body.sellNo);
					//data.sql = 'EXEC sp_DataShopBarcode \''+req.body.authKey+'\', '+req.body.sellNo;
					//res.json(data);
				}
			}
			else {
			}
		}
		else if (action == 'customer') {
			if (url[0] == 'list') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCustomerList \''+req.body.authKey+'\'');
				}
			}
			else {
			}
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
  else if (action == 'dataBarcode') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  data.result = recordset[0];
		  data.product = recordset[1];
		  data.brand = recordset[2];
		  data.category = recordset[3];
	  }
  }
  else if (action == 'success') {
	  data.success = true;
  }

  if (data.success) delete data.error;
  res.json(data);

}


exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}