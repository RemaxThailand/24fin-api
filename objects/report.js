var sql = require('mssql');
var config = require('../config.js');

exports.action = function(req, res, report, branch) {

	try {

		if (report == 'aging' || report == 'run_rate') {
		
			var connection = new sql.Connection(config.mssqlWangsing, function (err) {
				var request = new sql.Request(connection);
				//var branch = 1;
				//var report = 'aging';
				
				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});
				
				var d = new Date();
				var m = moment(d);
				m.lang('th');
				m.add(3600*7, 'seconds'); // GMT +7

				doc.moveTo(0, 0)
					.font('./fonts/ANGSAU.TTF', 16)
					.text(m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'), { align: 'right' })

				//### STOCK AGING REPORT ###//
				if (report == 'aging') {
					request.query('EXEC sp_ReportAging '+branch, function (err, recordset, returnValue) {
						if (!err){

							doc.font('./fonts/CALIBRIB.TTF', 18)
								.text('Stock Aging Report : Branch '+branch, 10, 10)


							doc.lineWidth(0.75)
								.moveTo(10, 30)
								.lineTo(585, 30)
								.stroke()

							var posX = [10, 315, 345, 375, 410, 445, 480, 515, 550, 585];
							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum90 = sum60 = sum30 = sum15 = sum0 = sum99 = 0;
							for (i=0; i<recordset.length; i++, index++) {
								y += 14;
								if ( y > 800 ) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i+1 < recordset.length) {
										if ( groupName == recordset[i+1]['groupName'] ) {
											drawHeadLine(doc, groupName, posX, y, 35);
											y += 18;
											startY = y;
										}
									}
									

								}
								if ( groupName != recordset[i]['groupName'] ) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLine(doc, groupName, posX, y, 35);
									y += 18;
									startY = y;							

								}

								doc.y = y; doc.x = posX[0]+2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index+'.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0]+25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0]+70;
								doc.text(recordset[i]['productName'], { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[1];
								doc.text((recordset[i]['cost'] > 0) ? numberWithCommas(recordset[i]['cost'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.text(recordset[i]['cost'].toFixed(0), { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[2];
								doc.text((recordset[i]['costPlan'] > 0) ? numberWithCommas(recordset[i]['costPlan'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.text(recordset[i]['costPlan'].toFixed(0), { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[3];
								doc.text((recordset[i]['90'] > 0) ? numberWithCommas(recordset[i]['90'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[4];
								doc.text((recordset[i]['60'] > 0) ? numberWithCommas(recordset[i]['60'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[5];
								doc.text((recordset[i]['30'] > 0) ? numberWithCommas(recordset[i]['30'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[6];
								doc.text((recordset[i]['15'] > 0) ? numberWithCommas(recordset[i]['15'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[7];
								doc.text((recordset[i]['0'] > 0) ? numberWithCommas(recordset[i]['0'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[8];
								doc.text((recordset[i]['qtyPlan'] > 0) ? numberWithCommas(recordset[i]['qtyPlan'].toFixed(0)) : '-', { width: 35, align: 'right' })

								doc.lineWidth(0.25)
									.moveTo(posX[0], y+15)
									.lineTo(posX[9], y+15)
									.dash(1, {space: 1})
									.stroke()

								sum90 += recordset[i]['cost']*recordset[i]['90'];
								sum60 += recordset[i]['cost']*recordset[i]['60'];
								sum30 += recordset[i]['cost']*recordset[i]['30'];
								sum15 += recordset[i]['cost']*recordset[i]['15'];
								sum0 += recordset[i]['cost']*recordset[i]['0'];
								sum99 += (recordset[i]['qtyPlan'] != 0 && recordset[i]['costPlan'] != 0) ? recordset[i]['costPlan']*recordset[i]['qtyPlan'] : 0;

								if ( recordset[i+1] == null || groupName != recordset[i+1]['groupName'] ) {
									if (sum90 != 0 || sum60 != 0 || sum30 != 0 || sum15 != 0 || sum0 != 0 || sum99 != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 10)
										doc.y = y; doc.x = posX[1];
										doc.text('มูลค่า', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[3];
										doc.text((sum90 > 0) ? numberWithCommas(sum90.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[4];
										doc.text((sum60 > 0) ? numberWithCommas(sum60.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[5];
										doc.text((sum30 > 0) ? numberWithCommas(sum30.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[6];
										doc.text((sum15 > 0) ? numberWithCommas(sum15.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[7];
										doc.text((sum0 > 0) ? numberWithCommas(sum0.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[8];
										doc.text((sum99 > 0) ? numberWithCommas(sum99.toFixed(0)) : '-', { width: 35, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1], y+13)
											.lineTo(posX[9], y+13)
											.dash(1, {space: 0})
											.stroke()

										sum90 = sum60 = sum30 = sum15 = sum0 = sum99 = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						}else{
						   res.send(err.message);
						}
					});
				}
				
				//### RUN RATE REPORT ###//
				else if (report == 'run_rate')
				{
					request.query('EXEC sp_ReportRunRate '+branch, function (err, recordset, returnValue) {
						if (!err){
							var posX = [10, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585];

							doc.font('./fonts/CALIBRIB.TTF', 18)
								.text('Stock Run Rate Report : Branch '+branch, 10, 10)

							doc.lineWidth(0.75)
								.moveTo(posX[0], 30)
								.lineTo(posX[9], 30)
								.stroke()

							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum = 0;
							for (i=0; i<recordset.length; i++, index++) {
								y += 14;
								if ( y > 800 ) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i+1 < recordset.length) {
										if ( groupName == recordset[i+1]['groupName'] ) {
											drawHeadLineRunRate(doc, groupName, posX, y, 30);
											y += 18;
											startY = y;
										}
									}
									

								}
								if ( groupName != recordset[i]['groupName'] ) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineRunRate(doc, groupName, posX, y, 30);
									y += 18;
									startY = y;							

								}

								doc.y = y; doc.x = posX[0]+2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index+'.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0]+25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0]+70;
								doc.text(recordset[i]['name'], { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[1];
								doc.text((recordset[i]['cost'] > 0) ? numberWithCommas(recordset[i]['cost'].toFixed(2)) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[2];
								doc.text((recordset[i]['stock'] > 0) ? numberWithCommas(recordset[i]['stock']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[3];
								doc.text((recordset[i]['d0'] > 0) ? numberWithCommas(recordset[i]['d0']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[4];
								doc.text((recordset[i]['d1'] > 0) ? numberWithCommas(recordset[i]['d1']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[5];
								doc.text((recordset[i]['d2'] > 0) ? numberWithCommas(recordset[i]['d2']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[6];
								doc.text((recordset[i]['d3'] > 0) ? numberWithCommas(recordset[i]['d3']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[7];
								doc.text((recordset[i]['d4'] > 0) ? numberWithCommas(recordset[i]['d4']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[8];
								doc.text((recordset[i]['d5'] > 0) ? numberWithCommas(recordset[i]['d5']) : '-', { width: 30, align: 'right' })

								doc.lineWidth(0.25)
									.moveTo(posX[0], y+15)
									.lineTo(posX[9], y+15)
									.dash(1, {space: 1})
									.stroke()

								sum += recordset[i]['stock'] > 0 ? recordset[i]['stock']*recordset[i]['cost'] : 0;

								if ( recordset[i+1] == null || groupName != recordset[i+1]['groupName'] ) {
									if (sum != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 12)
										doc.y = y; doc.x = posX[1] - 20;
										doc.text('มูลค่า', { width: 30, align: 'left' })
										doc.y = y; doc.x = posX[1];
										doc.text((sum > 0) ? numberWithCommas(sum.toFixed(0)) : '-', { width: 60, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1] - 25, y+15)
											.lineTo(posX[9], y+15)
											.dash(1, {space: 0})
											.stroke()

										sum = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();						

						}else{
						   res.send(err.message);
						}
					});
				}

			 });

		}

	}
	catch(err) {
		data.err = err;
		res.json(data);
	}

};

exports.generate = function(req, res, report, branch, orderNo) {

	try {

		if (report == 'order4customer' || report == 'order4office') {
		
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;
				
				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});
				
				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_DataOrderDetail '+branch+', \''+orderNo+'\'', function (err, recordset, returnValue) {
					if (!err){

						doc.image('./public/images/report/'+report+((recordset[1].length > 42) ? '0' : '')+'.png', 0, 0, {width:600});
						rq = require('request');

						rq({
							url: 'https://24fin-api.azurewebsites.net/barcode/'+orderNo,
							encoding: null
						}, function(err, response, body) {
							if (err) throw err;

							doc.image(body, 436, 107, {width:140});
								
							rq({
								url: 'https://24fin-api.azurewebsites.net/barcode/'+recordset[0][0]['member'],
								encoding: null
							}, function(err, response, body) {
								if (err) throw err;

								doc.image(body, 25, 47, {width:110});


								var d = new Date(recordset[0][0]['addDate']);
								var m = moment(d);
								m.lang('th');
								m.add(3600*7, 'seconds'); // GMT +7

								doc.y = 57;
								doc.x = 433;
								doc.font('./fonts/THSarabunBold.ttf', 16)
									.text('วันที่ ' + m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'))

								doc.y = 88.7; doc.x = 513;		doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
								doc.y = 29; doc.x = 67;				doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);

									
								doc.y = 24; doc.x = 150;			doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name']+((recordset[0][0]['contactName'] != '') ? ' ('+recordset[0][0]['contactName']+')' : ''))
									
								doc.y = 44; doc.x = 150;			doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

								doc.y = 70; doc.x = 67;				doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address']+' '+recordset[0][0]['address2']);
								var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
								doc.y = 90; doc.x = 67;				doc.text(((isBkk) ? 'แขวง' : 'ตำบล')+recordset[0][0]['subDistrict']+' '+((isBkk) ? 'เขต' : 'อำเภอ')+recordset[0][0]['district']+' '+((isBkk) ? '' : 'จังหวัด')+recordset[0][0]['province']+' รหัสไปรษณีย์ '+recordset[0][0]['zipcode']);
								doc.y = 110.5; doc.x = 67;		doc.text(recordset[0][0]['mobile'].substr(0,3)+'-'+recordset[0][0]['mobile'].substr(3,4)+'-'+recordset[0][0]['mobile'].substr(7,3));

								var y = 158;
								var page = 1;
								var maxY = 785;
								doc.font('./fonts/ANGSAU.TTF', 14);
								for (i=0; i<recordset[1].length; i++) {
									if ( page == 1){
										if ( y > maxY ) {
											doc.addPage();
											doc.image('./public/images/report/'+report+'1.png', 0, 0, {width:600});
											y = 35;
											page++;
										}
									}
									else {
										if ( y > maxY ) {
											doc.addPage();
											doc.image('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png', 0, 0, {width:600});
											doc.y = 10;	doc.x = 10;	doc.text('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png');
											y = 35;
											page++;
										}
									}
									y += 12;
									doc.y = y;	doc.x = 25;	doc.text(recordset[1][i]['sku']);
									doc.y = y;	doc.x = 89;	doc.text(recordset[1][i]['name']);
									if (report == 'order4office') {
										doc.font('./fonts/ANGSAU.TTF', 10);
										doc.y = y+2.5;	doc.x = 89;	doc.text((report == 'order4office' && recordset[1][i]['location'] != null) ? recordset[1][i]['location'] : '', { width:320, align: 'right' });
										doc.font('./fonts/ANGSAU.TTF', 14);
										doc.y = y;	doc.x = 419;	doc.text((recordset[1][i]['sellPrice'] != null) ? recordset[1][i]['sellPrice'] : '-');
										doc.y = y;	doc.x = 440;	doc.text(numberWithCommas(recordset[1][i]['price']), { width:25, align: 'right' });
										//doc.y = y;	doc.x = 440;	doc.text(recordset[1].length - i, { width:25, align: 'right' });
									}
									else {
										doc.y = y;	doc.x = 420;	doc.text(numberWithCommas(recordset[1][i]['price']), { width:35, align: 'right' });
									}
									doc.y = y;	doc.x = 475;	doc.text(numberWithCommas(recordset[1][i]['qty']), { width:26, align: 'right' });
									doc.y = y;	doc.x = 525;	doc.text(numberWithCommas(recordset[1][i]['totalPrice']), { width:43, align: 'right' });
								}

								if (report == 'order4office') {
									//doc.font('./fonts/THSarabun.ttf', 14);
									//doc.y = 802;	doc.x = 19;	doc.text((recordset[0][0]['manager'] == null) ? '-' : recordset[0][0]['manager'], { width:127, align: 'center' });
									//doc.y = 802;	doc.x = 150;	doc.text((recordset[0][0]['headSale'] == null) ? '-' : recordset[0][0]['headSale'], { width:128, align: 'center' });
									//doc.y = 802;	doc.x = 282;	doc.text((recordset[0][0]['sale'] == null) ? '-' : recordset[0][0]['sale'], { width:128, align: 'center' });
									doc.font('./fonts/THSarabun.ttf', 12);
									doc.y = 691;	doc.x = 460;	doc.text((recordset[0][0]['manager'] == null) ? '-' : recordset[0][0]['manager']); //, { width:128, align: 'center' });
									doc.y = 703;	doc.x = 460;	doc.text((recordset[0][0]['headSale'] == null) ? '-' : recordset[0][0]['headSale']); //, { width:128, align: 'center' });
									doc.y = 715;	doc.x = 460;	doc.text((recordset[0][0]['sale'] == null) ? '-' : recordset[0][0]['sale']); //, { width:128, align: 'center' });
								}

								doc.font('./fonts/CALIBRI.TTF', 14);
								doc.y = 733.5; doc.x = 523;		doc.text(numberWithCommas(recordset[0][0]['price']), { width:50, align: 'right' });
								doc.font('./fonts/CALIBRI.TTF', 12);
								doc.y = 752.5; doc.x = 491;		doc.text(recordset[0][0]['discount']);
								doc.y = 752.5; doc.x = 523;		doc.text((recordset[0][0]['discountPrice'] == 0) ? '-' : '-'+numberWithCommas(recordset[0][0]['discountPrice']), { width:50, align: 'right' });
								doc.y = 771; doc.x = 523;			doc.text((recordset[0][0]['couponPrice'] == 0) ? '-' : '-'+numberWithCommas(recordset[0][0]['couponPrice']), { width:50, align: 'right' });
								doc.y = 789; doc.x = 523;			doc.text((recordset[0][0]['shippingPrice'] == 0) ? '-' : numberWithCommas(recordset[0][0]['shippingPrice']), { width:50, align: 'right' });

								doc.font('./fonts/CALIBRIB.TTF', 14);
								doc.y = 807; doc.x = 523;	doc.text(numberWithCommas(recordset[0][0]['totalPrice']), { width:50, align: 'right' });

								doc.font('./fonts/CALIBRI.TTF', 9);
								doc.y = 772.25; doc.x = 414.5;	doc.text(recordset[0][0]['couponCode']);

								doc.pipe(res);
								doc.end();
								return;
							});
						});

					}else{
					   res.send(err.message);
					}
				});
			});
		}
		else if (report == 'envelope') {
		
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;
			
				var PDFDocument = require('pdfkit');
				var doc = new PDFDocument({margin: 10, size: 'A4'});
				request.query('EXEC sp_DataOrderAddress '+branch+', \''+orderNo+'\'', function (err, recordset, returnValue) {
					if (!err){

						for(i=1; i<=2; i++) {
							
							var y = (i == 1) ? 25 : 440;
							var x = 50;

							doc.font('./fonts/THSarabun.ttf', 16);
							doc.y = y; doc.x = x;	doc.text('ผู้ส่ง');
							doc.font('./fonts/THSarabunBold.ttf', 18);
							doc.y = y+25; doc.x = x+10;	doc.text('RemaxThailand');
							doc.font('./fonts/THSarabun.ttf', 16);
							doc.y = y+50; doc.x = x+10;	doc.text('โทรศัพท์ 081-2673-388');


							y += 140;
							x = 150;
							doc.font('./fonts/THSarabun.ttf', 18);
							doc.y = y; doc.x = x;	doc.text('กรุณาส่ง');
							doc.y = y; doc.x = x+100;	doc.text('โทรศัพท์ ' + recordset[0][0]['mobile'].substr(0,3)+'-'+recordset[0][0]['mobile'].substr(3,4)+'-'+recordset[0][0]['mobile'].substr(7,3));
							y += 30;

							doc.font('./fonts/THSarabunBold.ttf', 24);
							doc.y = y; doc.x = x+50;	doc.text('คุณ '+recordset[0][0]['firstname']+'  '+recordset[0][0]['lastname']);
							y += 27;

							if (recordset[0][0]['shopName'] != '') {
								doc.font('./fonts/THSarabunBold.ttf', 22);
								doc.y = y; doc.x = x+70;	doc.text(recordset[0][0]['shopName']);
								y += 27;
							}

							doc.font('./fonts/THSarabun.ttf', 20);
							doc.y = y; doc.x = x+70;	doc.text(recordset[0][0]['address']);
							y += 25;

							if (recordset[0][0]['address2'] != '') {
								doc.y = y; doc.x = x+70;	doc.text(recordset[0][0]['address2']);
								y += 25;
							}

							var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
							doc.y = y; doc.x = x+70;				doc.text(((isBkk) ? 'แขวง' : 'ต.')+recordset[0][0]['subDistrict']+' '+((isBkk) ? 'เขต' : 'อ.')+recordset[0][0]['district']+' '+ ((isBkk) ? '' : 'จ.')+recordset[0][0]['province']);
							y += 30;

							doc.y = y; doc.x = x+70;	doc.text('รหัสไปรษณีย์');
							doc.font('./fonts/THSarabunBold.ttf', 26);
							doc.y = y-3.5; doc.x = x+155;	doc.text(recordset[0][0]['zipcode']);
						}

						doc.pipe(res);
						doc.end();
					}
					else {
					}
				});
			});
		}
	}
	catch(err) {
		data.err = err;
		res.json(data);
	}

};

exports.dealer = function(req, res, firstname, lastname) {
	firstname = decodeURI(firstname);
	lastname = decodeURI(lastname);
	try {

		var request = require('request');

		request.post({headers: { 'referer': 'http://power-api-test.azurewebsites.net' }, url: 'http://power-api-test.azurewebsites.net/dealer/info',
			form: {
				apiKey: 'F505802E-D628-44AE-B691-705219927C62',
				firstname: firstname,
				lastname: lastname
			}
		},
		function (error, response, body) {
			console.log(JSON.parse(body));
			if (!error) {				
				var json = JSON.parse(body);
				json = json.result[0];


				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});

				var x = 10;
				var y = 10;

				doc.font('./fonts/THSarabun.ttf', 32);
				//doc.y = y; doc.x = x; doc.text('ชื่อผู้สมัคร', {width: 130, align: 'right'} );
				doc.font('./fonts/THSarabunBold.ttf', 32);
				doc.y = y; doc.x = x+140; doc.text( 'คุณ' + json.Firstname + '  ' + json.Lastname + ' (' + json.Nickname + ')' );
				y += 32;

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('เบอร์โทรศัพท์', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.Phone.substr(0,3)+'-'+json.Phone.substr(3,4)+'-'+json.Phone.substr(7) );
				y += 18;

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('เวลาที่สะดวกในการติดต่อ', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.TimeToContact );
				y += 18;

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('สนใจเป็นตัวแทนในจังหวัด', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.Province );
				y += 18;

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('ที่อยู่', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.Address );
				y += 38;

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.y = y; doc.x = x; doc.text('แนะนำประวัติ หรือกิจการ หรือรูปแบบการจำหน่าย');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Profile );
				doc.moveDown();

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.text('สาเหตุที่สนใจเป็นตัวแทนจำหน่าย');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Reason );
				doc.moveDown();

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.text('ความคาดหวังเมื่อเป็นตัวแทนจำหน่าย');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Expect );
				doc.moveDown();

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.text('ความคิดเห็น เกี่ยวกับการแข่งขันเพื่อความอยู่รอดในธุรกิจ');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Comment );
				doc.moveDown();

				/*if (typeof json.PictureUrl != 'undefined') {
					rq = require('request');
					var i = 0;
					if (typeof json.PictureUrl[i] != 'undefined' && json.PictureUrl[i] != '') {
						rq({ url: json.PictureUrl[i], encoding: null }, function(err, response, body) {
							if (err) throw err;
							doc.image(body, 30, 450, {width:250});
							i++;
							if (typeof json.PictureUrl[i] != 'undefined' && json.PictureUrl[i] != '') {
								rq({ url: json.PictureUrl[i], encoding: null }, function(err, response, body) {
									if (err) throw err;
									doc.image(body, 310, 450, {width:250});
									i++;
									if (typeof json.PictureUrl[i] != 'undefined' && json.PictureUrl[i] != '') {										
										rq({ url: json.PictureUrl[i], encoding: null }, function(err, response, body) {
											if (err) throw err;
											doc.image(body, 30, 660, {width:250});
											i++;
											if (typeof json.PictureUrl[i] != 'undefined' && json.PictureUrl[i] != '') {												
												rq({ url: json.PictureUrl[i], encoding: null }, function(err, response, body) {
													if (err) throw err;
													doc.image(body, 310, 660, {width:250});
													doc.pipe(res);
													doc.end();
												});
											}
											else { doc.pipe(res); doc.end(); }
										});
									}
									else { doc.pipe(res); doc.end(); }
								});
							}
							else { doc.pipe(res); doc.end(); }
						});
					}
				}
				else { doc.pipe(res); doc.end(); }*/
				doc.pipe(res); doc.end();



				//res.json(json);
			} else{
				data.err = error;
				res.json(data);
			}
		});

		/*

		var postString = '?apiKey=F505802E-D628-44AE-B691-705219927C62&firstname='+firstname+'&lastname='+lastname;
		var options = {
			host: 'http://power-api-test.azurewebsites.net',
			path: '/dealer/info',
			method: 'POST',
			headers: {
				referer: 'http://power-api-test.azurewebsites.net',
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
				

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});

				doc.font('./fonts/THSarabun.ttf', 16);
				doc.y = 10; doc.x = 10; doc.text('ชื่อผู้สมัคร ');

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.y = 10; doc.x = 70; doc.text( recordset ); //decodeURI(firstname) + '  ' + decodeURI(lastname) );

				doc.pipe(res);
				doc.end();


			});
		});

		postReq.write(postString);
		postReq.end();*/


		//data.success = 'xxxxxxxxx';
		//res.json(data);
	}
	catch(err) {
		data.err = err;
		res.json(data);
	}
}

exports.mail = function(req, res, report) {

	try {
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
		
		var moment = require('moment');
		
		var d = new Date();
		var m = moment(d);
		m.lang('th');
		m.add(3600*7, 'seconds'); // GMT +7

		var mailOptions;

		if ( report == 'run_rate' ) {
			mailOptions = {
				from: senderName + ' <' + senderEmail + '>',
				to: config.report.runRate,
				bcc: config.report.runRateBcc,
				subject: 'รายงาน Stock Run Rate : วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543),
				generateTextFromHTML: true,
				html: '<html><b>รายงาน Stock Run Rate : วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543)+'</b><br>(เอกสารตามไฟล์แนบ)<br><br><br><br><b>สามารถตรวจสอบข้อมูลแบบ Real-time ได้ที่</b><ul><li><a href="https://24fin-api.azurewebsites.net/report/run_rate/1">รายงาน Stock Run Rate สาขา 1</a></li><li><a href="https://24fin-api.azurewebsites.net/report/run_rate/4">รายงาน Stock Run Rate สาขา 4</a></li></ul></html>',
				attachments: [
					{
						filename: 'Stock Run Rate สาขา 1 - วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543)+'.pdf',
						path: 'https://24fin-api.azurewebsites.net/report/run_rate/1'
					},
					{
						filename: 'Stock Run Rate สาขา 4 - วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543)+'.pdf',
						path: 'https://24fin-api.azurewebsites.net/report/run_rate/4'
					}
				]
			};
		}
		else if ( report == 'aging' ) {
			mailOptions = {
				from: senderName + ' <' + senderEmail + '>',
				to: config.report.aging,
				bcc: config.report.agingBcc,
				subject: 'รายงาน Stock Aging : วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543),
				generateTextFromHTML: true,
				html: '<html><b>รายงาน Stock Aging : วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543)+'</b><br>(เอกสารตามไฟล์แนบ)<br><br><br><br><b>สามารถตรวจสอบข้อมูลแบบ Real-time ได้ที่</b><ul><li><a href="https://24fin-api.azurewebsites.net/report/aging/1">รายงาน Stock Aging สาขา 1</a></li><li><a href="https://24fin-api.azurewebsites.net/report/aging/4">รายงาน Stock Aging สาขา 4</a></li></ul></html>',
				attachments: [
					{
						filename: 'Stock Aging สาขา 1 - วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543)+'.pdf',
						path: 'https://24fin-api.azurewebsites.net/report/aging/1'
					},
					{
						filename: 'Stock Aging สาขา 4 - วันที่ '+m.format('D MMMM')+' '+(parseInt(m.format('YYYY'))+543)+'.pdf',
						path: 'https://24fin-api.azurewebsites.net/report/aging/4'
					}
				]
			};
		}

		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				res.send(error);
			} else {
				res.send(info.response);
			}
			smtpTransport.close();
		});

	}
	catch(err) {
		res.send(err);
	}

};


function drawHeadLine(doc, groupName, posX, y, width){
	
	doc.y = y; doc.x = posX[0];
	doc.font('./fonts/THSarabunBold.ttf', 18)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y+3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[2];
	doc.text('ทุนใหม่', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[3];
	doc.text('90', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[4];
	doc.text('60', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[5];
	doc.text('30', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[6];
	doc.text('15', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[7];
	doc.text('ปัจจุบัน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[8];
	doc.text('Plan', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y+18)
		.lineTo(posX[9], y+18)
		.dash(1, {space: 0})
		.stroke()
}

function drawHeadLineRunRate(doc, groupName, posX, y, width){
	
	doc.y = y+4; doc.x = posX[0];
	doc.font('./fonts/CALIBRIB.TTF', 12)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y+3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[2];
	doc.text('Stock', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[3];
	doc.text('วันนี้', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[4];
	doc.text('-1', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[5];
	doc.text('-2', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[6];
	doc.text('-3', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[7];
	doc.text('-4', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[8];
	doc.text('-5', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y+18)
		.lineTo(posX[9], y+18)
		.dash(1, {space: 0})
		.stroke()
}

	
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}