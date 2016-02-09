$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/member/exist/username' ) {
			$.post($('#api_url').val()+url, {
				username: $obj.parents('form').find('.username').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/exist/email' ) {
			$.post($('#api_url').val()+url, {
				email: $obj.parents('form').find('.email').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/exist/mobile' ) {
			$.post($('#api_url').val()+url, {
				mobile: $obj.parents('form').find('.mobile').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/exist/lineId' ) {
			$.post($('#api_url').val()+url, {
				lineId: $obj.parents('form').find('.lineId').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/exist/auth' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/info/auth' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/info/roles' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/screen/permission' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				system: $obj.parents('form').find('.system').val(),
				screen: $obj.parents('form').find('.screen').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/info/update' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				table: $obj.parents('form').find('.table').val(),
				key: $obj.parents('form').find('.key').val(),
				value: $obj.parents('form').find('.value').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/logout' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/register' ) {
			$.post($('#api_url').val()+url, {
				username: $obj.parents('form').find('.username').val(),
				password: $obj.parents('form').find('.password').val(),
				email: $obj.parents('form').find('.email').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/dealer/register' ) {
			$.post($('#api_url').val()+url, {
				firstname: $obj.parents('form').find('.firstname').val(),
				lastname: $obj.parents('form').find('.lastname').val(),
				email: $obj.parents('form').find('.email').val(),
				mobile: $obj.parents('form').find('.mobile').val(),
				lineId: $obj.parents('form').find('.lineId').val(),
				provinceCode: $obj.parents('form').find('.provinceCode').val(),
				referer: $obj.parents('form').find('.referer').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/dealer/add_info' ) {
			$.post($('#api_url').val()+url, {
				id: $obj.parents('form').find('.id').val(),
				username: $obj.parents('form').find('.username').val(),
				password: $obj.parents('form').find('.password').val(),
				shopName: $obj.parents('form').find('.shopName').val(),
				address: $obj.parents('form').find('.address').val(),
				address2: $obj.parents('form').find('.address2').val(),
				provinceCode: $obj.parents('form').find('.provinceCode').val(),
				districtCode: $obj.parents('form').find('.districtCode').val(),
				subDistrict: $obj.parents('form').find('.subDistrict').val(),
				zipcode: $obj.parents('form').find('.zipcode').val(),
				question1: $obj.parents('form').find('.question1').val(),
				question2: $obj.parents('form').find('.question2').val(),
				question3: $obj.parents('form').find('.question3').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/dealer/approve_email' ) {
			$.post($('#api_url').val()+url, {
				memberId: $obj.parents('form').find('.memberId').val(),
				imageList: $obj.parents('form').find('.imageList').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/dealer/register_info' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/login' ) {
			$.post($('#api_url').val()+url, {
				username: $obj.parents('form').find('.username').val(),
				password: $obj.parents('form').find('.password').val(),
				remember: $obj.parents('form').find('.remember').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/screen' ) {
			$.post($('#api_url').val()+url, {
				system: $obj.parents('form').find('.system').val(),
				memberType: $obj.parents('form').find('.memberType').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/teamwork' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/teamwork/mapping' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				secretCode: $obj.parents('form').find('.secretCode').val(),
				memberType: $obj.parents('form').find('.memberType').val(),
				insertKey: $obj.parents('form').find('.insertKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/teamwork/signin' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				memberId: $obj.parents('form').find('.memberId').val(),
				memberType: $obj.parents('form').find('.memberType').val(),
				updateKey: $obj.parents('form').find('.updateKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/screen/config/update' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				system: $obj.parents('form').find('.system').val(),
				screen: $obj.parents('form').find('.screen').val(),
				config: $obj.parents('form').find('.config').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/screen/config/data' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				system: $obj.parents('form').find('.system').val(),
				screen: $obj.parents('form').find('.screen').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/summary/alert' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				screen: $obj.parents('form').find('.screen').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/address/add' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				firstname: $obj.parents('form').find('.firstname').val(),
				lastname: $obj.parents('form').find('.lastname').val(),
				contactName: $obj.parents('form').find('.contactName').val(),
				mobilePhone: $obj.parents('form').find('.mobilePhone').val(),
				shopName: $obj.parents('form').find('.shopName').val(),
				address: $obj.parents('form').find('.address').val(),
				address2: $obj.parents('form').find('.address2').val(),
				subDistrict: $obj.parents('form').find('.subDistrict').val(),
				districtCode: $obj.parents('form').find('.districtCode').val(),
				provinceCode: $obj.parents('form').find('.provinceCode').val(),
				zipcode: $obj.parents('form').find('.zipcode').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/address/data' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/teamwork/data' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/commission/summary' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/commission/detail' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				orderNo: $obj.parents('form').find('.orderNo').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/sale_price/update' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				memberId: $obj.parents('form').find('.memberId').val(),
				salePrice: $obj.parents('form').find('.salePrice').val(),
				discount: $obj.parents('form').find('.discount').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/test/test' ) {
			$.post($('#api_url').val()+url, {
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/change_password' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				username: $obj.parents('form').find('.username').val(),
				currentPassword: $obj.parents('form').find('.currentPassword').val(),
				newPassword: $obj.parents('form').find('.newPassword').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/statistic/weekly_register' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
				memberType: $obj.parents('form').find('.memberType').val(),
				week: $obj.parents('form').find('.week').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/statistic/monthly_order' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/member/point/history' ) {
			$.post($('#api_url').val()+url, {
				query: $obj.parents('form').find('.query').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}


	});

});