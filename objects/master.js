var util = require('../objects/util');

exports.action = function(req, res, control, action, url) {

	try {

		if (action == 'thailand') {
			if (url[0] == 'province') {
				util.query(req, res, control, 'data', 'EXEC sp_DataProvince \''+req.body.language+'\'');
			}
			else if (url[0] == 'district') {
				if (typeof req.body.provinceCode == 'undefined' || req.body.provinceCode == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataDistrict \''+req.body.language+'\', \''+req.body.provinceCode+'\'');
				}
			}
		}
			
		else {
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
  if (action == 'exist') {
	  data.exist = recordset[0]['cnt'] > 0;
	  data.success = true;
  }
  else if (action == 'data') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  data.result = recordset;
	  }
  }
  else if (action == 'success') {
	  data.success = true;
  }

  if (data.success) delete data.error;
  res.json(data);
  delete data.result;
}


exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}