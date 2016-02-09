var util = require('../objects/util');

exports.action = function(req, res, control, action, url) {

	try {


		if (action == 'data') {
			if (url[0] == 'screen') {
				util.query(req, res, control, action, 'EXEC sp_DataScreen');
			}
			else if (url[0] == 'screen_mapping') {
				if (typeof req.body.system == 'undefined' || req.body.system == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, action, 'EXEC sp_DataScreenMapping \''+req.body.system+'\'');
				}
			}
		}
		else if (action == 'server') {
			if (url[0] == 'status') {
				if (typeof req.body.server == 'undefined' || req.body.server == '' ||
					typeof req.body.port == 'undefined' || req.body.port == '' ||
					typeof req.body.status == 'undefined' || req.body.status == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'success', 'EXEC sp_ServerUpdateStatus \''+req.body.server+'\', \''+req.body.port+'\', \''+req.body.status+'\', \''+req.body.updateBy+'\'');
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
  if (action == 'data') {
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

}

exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}