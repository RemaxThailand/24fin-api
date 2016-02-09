var util = require('../objects/util');


exports.action = function(req, res, control, action, url) {

	try {


		if (action == 'telnet') {
			if (typeof req.body.server == 'undefined' || typeof req.body.port == 'undefined' || req.body.server == '' || req.body.port == '') {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				data.server = req.body.server;
				data.port = req.body.port;

				var net = require('net');
				var sock = new net.Socket();
				sock.setTimeout(2500);
				sock.on('connect', function() {
					sock.destroy();
					data.success = true;
					delete data.error;
					res.json(data);
				}).on('error', function(e) {
					data.error = e.message;
					res.json(data);
				}).on('timeout', function(e) {
					data.error = 'Timeout';
					res.json(data);
				}).connect(req.body.port, req.body.server);
		  }
		}




		else if ( action == 'sendmail' ) {
			if (typeof req.body.to == 'undefined' || req.body.to == '' ||
				typeof req.body.subject == 'undefined' || req.body.subject == '' ||
				typeof req.body.message == 'undefined' || req.body.message == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				var config = require('../config.js');
				var nodemailer = require('nodemailer');

				var senderName = (typeof req.body.senderName != 'undefined' && req.body.senderName != '') ? req.body.senderName : config.gmail.senderName;
				var senderEmail = (typeof req.body.senderEmail != 'undefined' && req.body.senderEmail != '') ? req.body.senderEmail : config.gmail.senderEmail;
				var smtpTransport = nodemailer.createTransport('SMTP', {
					service: 'Gmail',
					auth: {
						XOAuth2: {
							user: config.gmail.username,
							clientId: config.gmail.clientId,
							clientSecret: config.gmail.clientSecret,
							refreshToken: config.gmail.refreshToken
						}
					}
				});

				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: config.gmail.username,
						pass: config.gmail.password
					}
				});

				var mailOptions = {
					from: senderName + ' <' + senderEmail + '>',
					to: req.body.to,
					subject: req.body.subject,
					generateTextFromHTML: true,
					html: req.body.message
				};

				transporter.sendMail(mailOptions, function(error, info){
					if(error){
						data.error = error;
					} else {
						data.info = info.response;
						data.success = true;
						delete data.error;
					}
					smtpTransport.close();
					res.json(data);
				});
			}
		}




		else if ( action == 'email' && url[0] == 'verify' ) {
			var verifier = require('email-verify');
			verifier.verify(req.body.email, function( info, err ){
				if (err) {
					data.error = err;
				}
				else if (info.success) {
					data.success = true;
					data.valid = true;
					delete data.error;
				}
				else {
					data.success = true;
					data.valid = false;
					delete data.error;
				}
				res.json(data);
			});
		}




		else if (action == 'data') {
			if (url[0] == 'insert') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.insertKey == 'undefined' || req.body.insertKey == '' ||
					typeof req.body.table == 'undefined' || req.body.table == '' ||
					typeof req.body.data == 'undefined' || req.body.data == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var sql = 'INSERT INTO ' + req.body.table + '(';
					var key = '';
					var value = '';
					var obj = JSON.parse(req.body.data);
					for (name in obj) {
						key += name+',';
						value += '\'\''+obj[name]+'\'\',';
					}
					sql += key.substr(0, key.length -1) + ', addDate, addBy) SELECT '+value.substr(0, value.length -1)+', GETDATE(), ';
					util.query(req, res, control, 'success', 'EXEC sp_TableInsert \''+req.body.authKey+'\', \''+req.body.insertKey+'\', \''+sql+'\'');
				}
			}
			else if (url[0] == 'update') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.updateKey == 'undefined' || req.body.updateKey == '' ||
					typeof req.body.table == 'undefined' || req.body.table == '' ||
					typeof req.body.column == 'undefined' || req.body.column == '' ||
					typeof req.body.where == 'undefined' || req.body.where == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var sql = 'UPDATE ' + req.body.table + ' SET updateDate = GETDATE(), updateBy = \'\'REPLACEUPDATEBY\'\', ' + req.body.column + ' = ' +
						((req.body.value == '' || req.body.value == null) ? 'NULL' : '\'\''+req.body.value+'\'\'') + 
						' WHERE ';
					var isFirst = true;
					var obj = JSON.parse(req.body.where);
					for (name in obj) {
						sql += ((isFirst) ? '' : ' AND ') + name+' = \'\''+obj[name]+'\'\'';
						isFirst = false
					}
					util.query(req, res, control, 'success', 'EXEC sp_TableUpdate \''+req.body.authKey+'\', \''+req.body.updateKey+'\', \''+sql+'\'');
				}
			}
			if (url[0] == 'delete') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.deleteKey == 'undefined' || req.body.deleteKey == '' ||
					typeof req.body.table == 'undefined' || req.body.table == '' ||
					typeof req.body.where == 'undefined' || req.body.where == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var sql = 'DELETE FROM ' + req.body.table + ' WHERE ';
					var isFirst = true;
					var obj = JSON.parse(req.body.where);
					for (name in obj) {
						sql += ((isFirst) ? '' : ' AND ') + name+' = \'\''+obj[name]+'\'\'';
						isFirst = false
					}
					util.query(req, res, control, 'success', 'EXEC sp_TableDelete \''+req.body.authKey+'\', \''+req.body.deleteKey+'\', \''+sql+'\'');
				}
			}
		}



		else if (action == 'dropbox') {
			if (url[0] == 'share') {
				if (typeof req.body.path == 'undefined' || req.body.path == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var config = require('../config.js');
					util.getUrl(req, res, control, 'dropbox-share', 'https://api.dropbox.com/1/shares/dropbox/' + req.body.path + config.dropboxConnectionString + 'short_url=false');
				}
			}
			else if (url[0] == 'search') {
				if (typeof req.body.path == 'undefined' || req.body.path == '' ||
					typeof req.body.query == 'undefined' || req.body.query == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var config = require('../config.js');
					util.getUrl(req, res, control, 'dropbox-search', 'https://api.dropbox.com/1/search/dropbox/' + req.body.path + config.dropboxConnectionString + 'query=' + req.body.query );
				}
			}
			else if (url[0] == 'sync_image') {
				if (typeof req.body.path == 'undefined' || req.body.path == '' ||
					typeof req.body.query == 'undefined' || req.body.query == '' ||
					typeof req.body.type == 'undefined' || req.body.type == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					var config = require('../config.js');
					util.getUrl(req, res, control, 'dropbox-sync-image', 'https://api.dropbox.com/1/search/dropbox/' + req.body.path + config.dropboxConnectionString + 'query=' + req.body.query );
				}
			}
			else if (url[0] == 'get_public_path') {
				util.query(req, res, control, 'get_public_path', 'EXEC sp_DataImageUpdatePublicPath');
			}
			else if (url[0] == 'get_upload_xxpath') {
				util.query(req, res, control, 'get_public_path', 'EXEC sp_DataImageUpdatePublicPath');
			}
		}


		else if (action == 'database') {
			if (url[0] == 'add_ip') {
				if (typeof req.body.system == 'undefined' || req.body.system == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else if ( process.env.mssqlAllowIpSystem.indexOf(req.body.system) == -1 ) {
					data.error = 'Your system do not allow access to use API';
					res.json(data);
				}
				else {

					var ex = req.headers['x-forwarded-for'].split(':');
					var ip = (req.body.ip != '') ? req.body.ip : ex[0];

					var sql = require('mssql');
					var config = require('../config.js');

					var connection = new sql.Connection(config.mssqlMaster, function (err) {
						var request = new sql.Request(connection);
						request.query('EXEC sp_set_firewall_rule N\'' + req.body.system + '\',\'' + ip + '\',\'' + ip + '\'', function (err, recordset, returnValue) {
							data.ipAddress = ip;	
							if (!err){
							   delete data.error;
							   data.success = true;
							} else {
							   data.error = err.message;							   
							}
						  res.json(data);

						});
					 });
				}
			}
			else {
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
  else if (action == 'dropbox-share') {
	  var json = JSON.parse(recordset);
	  if ( typeof json.url == 'undefined' ) {
		  data.error = json.error;
	  }
	  else {
		  data.success = true;
		  data.url = json.url.replace('?dl=0', '?dl=1');
	  }
  }
  else if (action == 'get_public_path') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  var cnt = recordset.length;
		  var config = require('../config.js');
		  var command = [];
		  for( i=0; i<cnt; i++ ) {
			  updateUrl( req, res, config.dropboxConnectionString, recordset[i], command, cnt );
		  }
		  data.success = true;
	  }
	  //util.query(req, res, control, 'get_public_path', 'EXEC sp_DataImageUpdatePublicPath');
  }
  else if (action == 'dropbox-search') {
	  var json = JSON.parse(recordset);
	  if ( typeof json == 'undefined' ) {
		  data.error = json.error;
	  }
	  else if ( typeof json[0] == 'undefined' ) {
		  data.success = true;
		  data.result = recordset;
	  }
	  else {
		  data.success = true;
		  var cnt = json.length;
		  for (i=0; i<cnt; i++) {
			  delete json[i].parent_shared_folder_id;
			  delete json[i].icon;
			  delete json[i].client_mtime;
			  delete json[i].rev;
			  delete json[i].root;
			  delete json[i].size;
			  delete json[i].read_only;
			  delete json[i].thumb_exists;
			  var tmp = json[i].modifier.display_name;
			  delete json[i].modifier;
			  json[i].modifier = tmp;
			  tmp = json[i].modified.split(',');
			  tmp = tmp[1].split('+');
			  json[i].modified = getDate(tmp[0].trim());
			  tmp = json[i].path.split(req.body.path);
			  json[i].path = tmp[1];
		  }
		  data.result = json;
	  }
  }
	else if (action == 'dropbox-sync-image') {
		  var json = JSON.parse(recordset);
		  if ( typeof json == 'undefined' ) {
			  data.error = json.error;
		  }
		  else if ( typeof json[0] == 'undefined' ) {
			  data.success = true;
			  data.result = recordset;
		  }
		  else {
			  data.success = true;
			  var command = [];
			  var cnt = json.length;
			  for (i=0; i<cnt; i++) {

				  var tmp = json[i].modified.split(',');
				  tmp = tmp[1].split('+');
				  json[i].modified = getDate(tmp[0].trim());
				  
				  tmp = json[i].path.split('/');
				  
				  command.push('EXEC sp_ImageUpdate \'1\', \'product\', \''+tmp[tmp.length-2]+'\', \''+json[i].path+'\', \''+json[i].bytes+'\', \''+json[i].mime_type+'\', \''+json[i].revision+'\', \''+ req.body.type +'\', \''+json[i].modified+'\', \'' + json[i].modifier.display_name + '\', \'Azure API\'');

			  }

			  util.batchJob(req, res, command.join('; '));
			  
		  //data.result = json;
		  }
		}

  if (data.success) delete data.error;
  res.json(data);
}


exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}

function getDate( str ){
	var arr = str.split(' ');
	var months = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun','jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	var month = months.indexOf(arr[1].toLowerCase());
	return arr[2]+'-'+month+'-'+arr[0]+' '+arr[3];
}

function updateUrl(req, res, dropboxConnectionString, recordset, command, cnt) {
	var http = require('https');	
	http.get('https://api.dropbox.com/1/shares/dropbox' + recordset.localPath + dropboxConnectionString + 'short_url=false', function(response) {
		response.setEncoding('utf8');
		var html = '';
		response.on('error', function (e) {
			console.log(e.message);
		});
		response.on('data', function (chunk) {
			html += chunk;
		});
		response.on('end', function (chunk) {
			var json = JSON.parse(html);
			if (typeof json.url != 'undefined') {
				command.push('EXEC sp_ImageUpdatePublicPath \''+recordset.shop+'\', \''+recordset.type+'\', \''+recordset.id+'\', \''+recordset.size+'\', \''+json.url.replace('?dl=0', '?raw=1')+'\'');
				if (command.length == cnt) {
					var sql = require('mssql');
					var config = require('../config.js');
					var connection = new sql.Connection(config.mssql, function (err) {
						var request = new sql.Request(connection);
						request.batch(command.join('; '), function (err, recordset, returnValue) {
							if (err){
								console.log( err.message );
							}
						});
					 });
				}
			}
			else {
				command.push(' ');
			}
		});
	});

}

