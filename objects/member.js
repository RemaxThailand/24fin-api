var util = require('../objects/util');

exports.action = function(req, res, control, action, url) {

	try {

		if (action == 'exist') {
			if (url[0] == 'username') {
				if (typeof req.body.username == 'undefined' || req.body.username == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, action, 'EXEC sp_ExistMember \''+req.body.username+'\'');
				}
			}
			else if (url[0] == 'email') {
				if (typeof req.body.email == 'undefined' || req.body.email == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, action, 'EXEC sp_ExistEmail \''+req.body.email+'\'');
				}
			}
			else if (url[0] == 'mobile') {
				if (typeof req.body.mobile == 'undefined' || req.body.mobile == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, action, 'EXEC sp_ExistMobile \''+req.body.mobile+'\'');
				}
			}
			else if (url[0] == 'lineId') {
				if (typeof req.body.lineId == 'undefined' || req.body.lineId == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, action, 'EXEC sp_ExistLineId \''+req.body.lineId+'\'');
				}
			}
			else if (url[0] == 'auth') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					data.authKey = req.body.authKey;
					util.query(req, res, control, action, 'EXEC sp_ExistAuth \''+req.body.authKey+'\'');
				}
			}
		}
		else if (action == 'info') {
			if (url[0] == 'auth') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					data.authKey = req.body.authKey;
					util.queryMultiple(req, res, control, 'data', 'EXEC sp_MemberInfoAuth \''+req.body.authKey+'\'; EXEC sp_MemberScreenAuth \'backend\', \''+req.body.authKey+'\';');
				}
			}
			else if (url[0] == 'roles') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_MemberTypeAuth \''+req.body.authKey+'\'');
				}
			}
			else if (url[0] == 'update') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.table == 'undefined' || req.body.table == '' ||
					typeof req.body.key == 'undefined' || req.body.key == '' ||
					typeof req.body.value == 'undefined' || req.body.value == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'success', 'EXEC sp_MemberInfoUpdate \''+req.body.authKey+'\', \''+req.body.table+'\', \''+req.body.key+'\', \''+req.body.value+'\'');
				}
			}
		}
		else if (action == 'screen') {
			if (url[0] == 'permission') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.system == 'undefined' || req.body.system == '' ||
					typeof req.body.screen == 'undefined' || req.body.screen == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'data', 'EXEC sp_MemberScreenPermission \''+req.body.authKey+'\', \''+req.body.system+'\', \''+req.body.screen+'\'');
				}
			}
			else if (url[0] == 'config') {
				if (url[1] == 'data') {
					if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' || 
						typeof req.body.system == 'undefined' || req.body.system == '' || 
						typeof req.body.screen == 'undefined' || req.body.screen == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
					}
					else if ( process.env.allowSystem.indexOf(req.body.system) == -1 ) {
						data.error = 'Your system do not allow access to use API';
						res.json(data);
					}
					else {
						util.query(req, res, control, 'data', 'EXEC sp_DataMemberScreenConfig \''+req.body.authKey+'\', \''+req.body.system+'\', \''+req.body.screen+'\'');
					}
				}
				else if (url[1] == 'update') {
					if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' || 
						typeof req.body.system == 'undefined' || req.body.system == '' || 
						typeof req.body.screen == 'undefined' || req.body.screen == '' || 
						typeof req.body.config == 'undefined' || req.body.config == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
					}
					else if ( process.env.allowSystem.indexOf(req.body.system) == -1 ) {
						data.error = 'Your system do not allow access to use API';
						res.json(data);
					}
					else {
						try {
							JSON.parse(req.body.config);
							util.query(req, res, control, 'success', 'EXEC sp_MemberScreenConfigUpdate \''+req.body.authKey+'\', \''+req.body.system+'\', \''+req.body.screen+'\', \''+req.body.config+'\'');
						} catch (e) {
							data.error = 'Please input JSON Format';
							res.json(data);
						}
					}
				}
			}
			else {				
				if (typeof req.body.system == 'undefined' || req.body.system == '' ||
					typeof req.body.memberType == 'undefined' || req.body.memberType == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_MemberScreen \''+req.body.system+'\', \''+req.body.memberType+'\'');
				}
			}
		}
		else if (action == 'sale_price') {
			if (url[0] == 'update') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.memberId == 'undefined' || req.body.memberId == '' ||
					typeof req.body.salePrice == 'undefined' || req.body.salePrice == '' ||
					typeof req.body.discount == 'undefined' || req.body.discount == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'success', 'EXEC sp_MemberDiscountUpdate \''+req.body.authKey+'\', \''+req.body.memberId+'\', \''+req.body.salePrice+'\', \''+req.body.discount+'\'');
				}
			}
		}
		else if (action == 'logout') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'success', 'EXEC sp_Logout \''+req.body.authKey+'\'');
			}
		}
		else if (action == 'register') {
			if (typeof req.body.username == 'undefined' || req.body.username == '' ||
				typeof req.body.password == 'undefined' || req.body.password == '' ||
				typeof req.body.email == 'undefined' || req.body.email == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'success', 'EXEC sp_Register \''+req.body.username+'\', \''+util.encrypt(req.body.password, req.body.username.toLowerCase())+'\', \''+req.body.email+'\'');
			}
		}
		else if (action == 'dealer') {
			if (url[0] == 'register') {
				if (typeof req.body.firstname == 'undefined' || req.body.firstname == '' ||
					typeof req.body.lastname == 'undefined' || req.body.lastname == '' ||
					typeof req.body.email == 'undefined' || req.body.email == '' ||
					typeof req.body.mobile == 'undefined' || req.body.mobile == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
				}
				else {
					util.query(req, res, control, 'register', 'EXEC sp_DealerRegister \''+req.body.firstname+'\', \''+req.body.lastname+'\', \''+req.body.email+'\', \''+req.body.mobile+'\', \''+req.body.lineId+'\', \''+req.body.provinceCode+'\', \''+req.body.referer+'\'');
				}
			}
			else if (url[0] == 'add_info') {
				if (typeof req.body.id == 'undefined' || req.body.id == '' ||
					typeof req.body.username == 'undefined' || req.body.username == '' ||
					typeof req.body.password == 'undefined' || req.body.password == '' ||
					typeof req.body.shopName == 'undefined' || req.body.shopName == '' ||
					typeof req.body.address == 'undefined' || req.body.address == '' ||
					typeof req.body.provinceCode == 'undefined' || req.body.provinceCode == '' ||
					typeof req.body.districtCode == 'undefined' || req.body.districtCode == '' ||
					typeof req.body.subDistrict == 'undefined' || req.body.subDistrict == '' ||
					typeof req.body.zipcode == 'undefined' || req.body.zipcode == '' ||
					typeof req.body.question1 == 'undefined' || req.body.question1 == '' ||
					typeof req.body.question2 == 'undefined' || req.body.question2 == '' ||
					typeof req.body.question3 == 'undefined' || req.body.question3 == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
				}
				else {
					util.query(req, res, control, 'dealerAddInfo', 'EXEC sp_DealerAddInfo \''+req.body.id+'\', \''+req.body.username+'\', \''+util.encrypt(req.body.password, req.body.username.toLowerCase())+'\', \''+req.body.shopName+'\', \''+req.body.address+'\', \''+req.body.address2+'\', \''+req.body.subDistrict+'\', \''+req.body.districtCode+'\', \''+req.body.provinceCode+'\', \''+req.body.zipcode+'\', \''+req.body.question1+'\', \''+req.body.question2+'\', \''+req.body.question3+'\'');
				}
			}
			else if (url[0] == 'approve_email') {
				if (typeof req.body.memberId == 'undefined' || req.body.memberId == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
				}
				else {
					util.query(req, res, control, 'dealerForApprove', 'EXEC sp_DataDealerInfo \''+req.body.memberId+'\'');
				}
			}
			else if (url[0] == 'approved') {
				if (typeof req.body.memberId == 'undefined' || req.body.memberId == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
				}
				else {
					util.query(req, res, control, 'dealerApproved', 'EXEC sp_DataDealerApproved \''+req.body.memberId+'\'');
				}
			}
			else if (url[0] == 'register_info') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '') {
						data.error = 'Please fill out all required fields';
						res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataDealerCount \''+req.body.shop+'\'');
				}
			}
		}
		else if (action == 'login') {
			if (typeof req.body.username == 'undefined' || req.body.username == '' ||
				typeof req.body.password == 'undefined' || req.body.password == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				var md5 = require('MD5');
				util.query(req, res, control, action, 'EXEC sp_Login \''
				  +req.body.username+'\', \''
				  +util.encrypt(req.body.password, req.body.username.toLowerCase())+'\', \''
				  +md5(req.body.password)+'\', \''
				  +((req.body.remember == '1') ? 1 : 0)+'\'');
			}
		}
		else if (action == 'teamwork') {
			if (url[0] == 'mapping') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.secretCode == 'undefined' || req.body.secretCode == '' ||
					typeof req.body.memberType == 'undefined' || req.body.memberType == ''  ||
					typeof req.body.insertKey == 'undefined' || req.body.insertKey == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataTeamworkMapping \''+req.body.authKey+'\', \''+req.body.secretCode+'\', \''+req.body.memberType+'\', \''+req.body.insertKey+'\'');
				}
			}
			else if (url[0] == 'signin') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.memberId == 'undefined' || req.body.memberId == ''  ||
					typeof req.body.memberType == 'undefined' || req.body.memberType == ''  ||
					typeof req.body.updateKey == 'undefined' || req.body.updateKey == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'exist', 'EXEC sp_TeamworkSignin \''+req.body.authKey+'\', \''+req.body.memberId+'\', \''+req.body.memberType+'\', \''+req.body.updateKey+'\'');
				}
			}
			else if (url[0] == 'data') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataTeamworkName \''+req.body.authKey+'\'');
				}
			}
			else {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataTeamwork \''+req.body.authKey+'\'');
				}
			}
		}
		else if (action == 'commission') {
			if (url[0] == 'summary') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCommissionHeader \''+req.body.authKey+'\'');
				}
			}
			else if (url[0] == 'detail') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.authKey == 'orderNo' || req.body.orderNo == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataCommissionDetail \''+req.body.authKey+'\', \''+req.body.orderNo+'\'');
				}
			}
		}
		else if (action == 'summary') {
			if (url[0] == 'alert') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.screen == 'undefined' || req.body.screen == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataSummaryAlert \''+req.body.authKey+'\', \''+req.body.screen+'\'');
				}
			}
		}
		else if (action == 'order') {
			if (url[0] == 'header') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataOrderHistory \''+req.body.authKey+'\'');
				}
			}
		}
		else if (action == 'address') {
			if (url[0] == 'data') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataMemberAddress \''+req.body.authKey+'\'');
				}
			}
			if (url[0] == 'add') {
				if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
					typeof req.body.firstname == 'undefined' || req.body.firstname == '' ||
					typeof req.body.lastname == 'undefined' || req.body.lastname == '' ||
					typeof req.body.mobilePhone == 'undefined' || req.body.mobilePhone == '' ||
					typeof req.body.address == 'undefined' || req.body.address == '' ||
					typeof req.body.subDistrict == 'undefined' || req.body.subDistrict == '' ||
					typeof req.body.districtCode == 'undefined' || req.body.districtCode == '' ||
					typeof req.body.provinceCode == 'undefined' || req.body.provinceCode == '' ||
					typeof req.body.zipcode == 'undefined' || req.body.zipcode == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'success', 'EXEC sp_MemberAddressUpdate \''+req.body.authKey+'\', \''+req.body.firstname+'\', \''+req.body.lastname+'\', \''+req.body.contactName+'\', \''+req.body.mobilePhone+'\', \''+req.body.shopName+'\', \''+req.body.address+'\', \''+req.body.address2+'\', \''+req.body.subDistrict+'\', \''+req.body.districtCode+'\', \''+req.body.provinceCode+'\', \''+req.body.zipcode+'\'');
				}
			}
		}
		else if (action == 'change_password') {
			if (typeof req.body.authKey == 'undefined' || req.body.authKey == '' ||
				typeof req.body.username == 'undefined' || req.body.username == '' ||
				typeof req.body.currentPassword == 'undefined' || req.body.currentPassword == '' ||
				typeof req.body.newPassword == 'undefined' || req.body.newPassword == '' ) {
				data.error = 'Please fill out all required fields';
				res.json(data);
			}
			else {
				util.query(req, res, control, 'data', 'EXEC sp_ChangePassword \''+req.body.authKey+'\', \''+util.encrypt(req.body.currentPassword, req.body.username.toLowerCase())+'\', \''+util.encrypt(req.body.newPassword, req.body.username.toLowerCase())+'\'');
			}
		}
		else if (action == 'statistic') {
			if (url[0] == 'weekly_register') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '' ||
					typeof req.body.memberType == 'undefined' || req.body.memberType == '' ||
					typeof req.body.week == 'undefined' || req.body.week == '' ) {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'weekly_register', 'EXEC sp_DataDealerWeeklyRegis \''+req.body.shop+'\', \''+req.body.memberType+'\', '+req.body.week);
				}
			}
			else if (url[0] == 'monthly_order') {
				if (typeof req.body.shop == 'undefined' || req.body.shop == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.query(req, res, control, 'data', 'EXEC sp_DataDealerMonthlyOrder \''+req.body.shop+'\'');
				}
			}
		}
		else if (action == 'point') {
			if (url[0] == 'history') {
				if (typeof req.body.query == 'undefined' || req.body.query == '') {
					data.error = 'Please fill out all required fields';
					res.json(data);
				}
				else {
					util.queryMultiple(req, res, control, 'point_history', 'EXEC sp_DataPoint \''+req.body.query+'\'');
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
  else if (action == 'info') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  data.info = recordset[0];
	  }
  }
  else if (action == 'data') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  data.result = recordset;
	  }
  }
  else if (action == 'point_history') {
	  data.success = true;
	  data.correct = typeof recordset[0][0]['totalPrice'] != 'undefined';
	  if (data.correct) {
		  data.realPoint = recordset[0][0]['totalPrice'];
		  data.tempPoint = recordset[0][1]['totalPrice'];
		  data.credit = recordset[2][0]['totalPrice'];
		  data.info = {};
		  data.info.memberId = recordset[1][0]['member'];
		  data.info.name = recordset[1][0]['name'];
		  data.info.contactName = recordset[1][0]['contactName'];
		  data.info.shopName = recordset[1][0]['shopName'];
		  data.info.mobile = recordset[1][0]['mobile'];
		  data.info.email = recordset[1][0]['email'];
	  }
  }
  else if (action == 'weekly_register') {
	  data.success = true;
	  data.correct = typeof recordset[0] != 'undefined';
	  if (data.correct) {
		  var chart = [];
		  var cnt = parseInt(req.body.week);
		  var week = 0;
		  for(i=0; i<cnt; i++){
			  var struct = {};
			  struct.index = cnt-i;
			  if ( recordset[week].weekNo == i ) {
				  struct.date = recordset[week].regisDate;
				  struct.register = recordset[week].cnt;
				  week++;
			  }
			  else {
				  struct.date = '';
				  struct.register = 0;
			  }
			  chart.push(struct);
		  }
		  data.result = chart;
	  }
  }
  else if (action == 'success') {
	  data.success = true;
  }
  else if (action == 'login') {
	  data.success = true;
	  data.correct = (typeof recordset[0] == 'undefined') ? false : recordset[0]['cnt'] > 0;
	  if (data.correct) {
		  data.authKey = recordset[0]['authKey'];
		  data.expireDate = recordset[0]['expireDate'];
		  data.name = recordset[0]['name'];
	  }
  }
  else if (action == 'register') {
	data.correct = typeof recordset[0] != 'undefined';
	if (data.correct) {
		data.id = recordset[0]['id'];

		var config = require('../config.js');
		var nodemailer = require('nodemailer');
		var fs = require('fs');
		
		var senderName = config.gmail.senderName;
		var senderEmail = config.gmail.senderEmail;
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

		var sentCount = 0;

		fs.readFile('../wwwroot/views/email/dealer-register.html', function read(err, message) {
			if (err)
			{
				data.error = err;
				res.json(data);
			}
			else {
				//req.body.firstname+'\', \''+req.body.lastname+'\', \''+req.body.email+'\', \''+req.body.mobile+'\', \''+req.body.lineId+'\'');

				var html = (''+message).replace(/REPLACFIRSTNAME/g, req.body.firstname)
					.replace(/REPLACEREFID/g, data.id);
				var mailOptions = {
					from: senderName + ' <' + senderEmail + '>',
					to: req.body.email,
					subject: 'ขอบคุณที่ให้ความสนใจเป็น Dealer สินค้า Remax ค่ะ',
					generateTextFromHTML: true,
					html: html,
				};

				transporter.sendMail(mailOptions, function(error, info){
					sentCount++;
					if(error){
						data.error = error;
						util.queryNull('UPDATE TempMember SET emailResponse = \''+error+'\' WHERE id = \''+data.id+'\'');
					} else {
						data.info = info.response;
						data.success = true;
						delete data.error;
						util.queryNull('UPDATE TempMember SET emailResponse = \''+info.response+'\' WHERE id = \''+data.id+'\'');
					}
					if (sentCount == 2) smtpTransport.close();
					res.json(data);
				});

			}
		});

		fs.readFile('../wwwroot/views/email/dealer-register-alert.html', function read(err, message) {
			if (err)
			{
				data.error = err;
				res.json(data);
			}
			else {
				var html = (''+message).replace(/REPLACEFIRSTNAME/g, req.body.firstname)
					.replace(/REPLACELASTNAME/g, req.body.lastname)
					.replace(/REPLACEEMAIL/g, req.body.email)
					.replace(/REPLACEMOBILE/g, req.body.mobile)
					.replace(/REPLACELINE/g, req.body.lineId)
					.replace(/REPLACEREFID/g, data.id);
				var mailOptions = {
					from: senderName + ' <' + senderEmail + '>',
					to: config.dealer.approver,
					subject: 'มีผู้สนใจสมัครเป็น Dealer (คุณ'+req.body.firstname+')',
					generateTextFromHTML: true,
					html: html,
				};

				transporter.sendMail(mailOptions, function(error, info){
					sentCount++;
					if(error){
						//data.error = error;
					} else {
						//data.info = info.response;
						//data.success = true;
						//delete data.error;
					}
					if (sentCount == 2) smtpTransport.close();
					//res.json(data);
				});

			}
		});

	}
  }
  else if (action == 'dealerAddInfo') {
	data.correct = typeof recordset[0] != 'undefined';
	if (data.correct) {
		data.id = recordset[0]['id'];

		var config = require('../config.js');
		var nodemailer = require('nodemailer');
		var fs = require('fs');
		
		var senderName = config.gmail.senderName;
		var senderEmail = config.gmail.senderEmail;
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

		fs.readFile('../wwwroot/views/email/dealer-add_info.html', function read(err, message) {
			if (err)
			{
				data.error = err;
				res.json(data);
			}
			else {
				var html = (''+message).replace(/REPLACFIRSTNAME/g, recordset[0]['name'])
					.replace(/REPLACEUSERNAME/g, req.body.username)
					.replace(/REPLACEPASSWORD/g, req.body.password);
				var mailOptions = {
					from: senderName + ' <' + senderEmail + '>',
					to: recordset[0]['email'],
					subject: 'ยินดีต้อนรับสู่ครอบครัว Remax ค่ะ',
					generateTextFromHTML: true,
					html: html,
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
		});

	}
  }
  else if (action == 'dealerForApprove') {
	data.correct = typeof recordset[0] != 'undefined';
	if (data.correct) {

		var config = require('../config.js');
		var nodemailer = require('nodemailer');
		var fs = require('fs');
		
		var senderName = config.gmail.senderName;
		var senderEmail = config.gmail.senderEmail;
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

		fs.readFile('../wwwroot/views/email/dealer-approve.html', function read(err, message) {
			if (err)
			{
				data.error = err;
				res.json(data);
			}
			else {
				var question2 = (((recordset[0]['question2'].indexOf('ws') != -1) ? 'ขายส่ง ' : '') + ((recordset[0]['question2'].indexOf('rt') != -1) ? 'ขายปลีก ' : '') + ((recordset[0]['question2'].indexOf('ol') != -1) ? 'ขายออนไลน์ ' : '')).replace(/ /g, ', ');

				var question3 = (((recordset[0]['question3'].indexOf('ln') != -1) ? 'Line ' : '') + ((recordset[0]['question3'].indexOf('em') != -1) ? 'อีเมล ' : '') + ((recordset[0]['question3'].indexOf('fb') != -1) ? 'Facebook ' : '')).replace(/ /g, ', ');

				var html = (''+message).replace(/REPLACEFIRSTNAME/g, recordset[0]['firstname'])
					.replace(/REPLACELASTNAME/g, recordset[0]['lastname'])
					.replace(/REPLACEID/g, req.body.memberId)
					.replace(/REPLACEEMAIL/g, recordset[0]['email'])
					.replace(/REPLACEMOBILE/g, recordset[0]['mobile'])
					.replace(/REPLACELINE/g, recordset[0]['line'])
					.replace(/REPLACESHOP/g, recordset[0]['shopName'])
					.replace(/REPLACEADDRESS2/g, recordset[0]['address2'])
					.replace(/REPLACEADDRESS/g, recordset[0]['address'])
					.replace(/REPLACESUBDISTRICT/g, recordset[0]['subDistrict'])
					.replace(/REPLACEDISTRICT/g, recordset[0]['district'])
					.replace(/REPLACEPROVINCE/g, recordset[0]['province'])
					.replace(/REPLACEZIPCODE/g, recordset[0]['zipcode'])
					.replace(/REPLACEACCESS/g, (recordset[0]['question1'] == '0') ? 'ไม่เคย' : 'เคย')
					.replace(/REPLACEBUZZ/g, question2.substr(0, question2.length-2)  )
					.replace(/REPLACENEWS/g, question3.substr(0, question3.length-2)  )					
					.replace(/REPLACEIMG1/g, (req.body.imageList.indexOf('1') != -1) ? '<img src="http://www.remaxthailand.co.th/images/'+req.body.memberId+'-1"><br /><br />' : '')
					.replace(/REPLACEIMG2/g, (req.body.imageList.indexOf('2') != -1) ? '<img src="http://www.remaxthailand.co.th/images/'+req.body.memberId+'-2"><br /><br />' : '')
					.replace(/REPLACEIMG3/g, (req.body.imageList.indexOf('3') != -1) ? '<img src="http://www.remaxthailand.co.th/images/'+req.body.memberId+'-3"><br /><br />' : '')
					.replace(/REPLACEIMG4/g, (req.body.imageList.indexOf('4') != -1) ? '<img src="http://www.remaxthailand.co.th/images/'+req.body.memberId+'-4"><br /><br />' : '');

				var mailOptions = {
					from: senderName + ' <' + senderEmail + '>',
					to: config.dealer.approver,
					subject: 'มีผู้สมัคร Dealer ใหม่ รอการอนุมัติ (ร้าน'+recordset[0]['shopName']+')',
					generateTextFromHTML: true,
					html: html,
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
		});

	}
  }
  else if (action == 'dealerApproved') {
	data.correct = typeof recordset[0] != 'undefined';
	if (data.correct) {

		var config = require('../config.js');
		var nodemailer = require('nodemailer');
		var fs = require('fs');
		
		var senderName = config.gmail.senderName;
		var senderEmail = config.gmail.senderEmail;
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

		fs.readFile('../wwwroot/views/email/dealer-approved.html', function read(err, message) {
			if (err)
			{
				data.error = err;
				res.json(data);
			}
			else {
				var html = (''+message).replace(/REPLACEFIRSTNAME/g, recordset[0]['firstname'])
					.replace(/REPLACECODE/g, recordset[0]['code']);

				var mailOptions = {
					from: senderName + ' <' + senderEmail + '>',
					to: recordset[0]['email'],
					subject: 'อนุมัติการสมัครเป็นตัวแทนจำหน่ายเรียบร้อยแล้ว',
					generateTextFromHTML: true,
					html: html,
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
		});

	}
  }

  if (action != 'register' && action != 'dealerAddInfo' && action != 'dealerForApprove' && action != 'dealerApproved') {
	  if (data.success) delete data.error;
	  res.json(data);
  }

}


exports.error = function(req, res, action, err) {
	data.error = err;
	res.json(data);
}