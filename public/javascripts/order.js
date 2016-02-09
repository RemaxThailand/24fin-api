$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/order/sendmail/confirm' ) {
			$.post($('#api_url').val()+url, {
				orderNo: $obj.parents('form').find('.orderNo').val(),
				items: $obj.parents('form').find('.items').val(),
				qty: $obj.parents('form').find('.qty').val(),
				price: $obj.parents('form').find('.price').val(),
				name: $obj.parents('form').find('.name').val(),
				nickname: $obj.parents('form').find('.nickname').val(),
				telephoneNo: $obj.parents('form').find('.telephoneNo').val(),
				shopName: $obj.parents('form').find('.shopName').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/cart/update' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				productCode: $obj.parents('form').find('.productCode').val(),
				qty: $obj.parents('form').find('.qty').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/cart/detail' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/cart/summary' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/update' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				productCode: $obj.parents('form').find('.productCode').val(),
				qty: $obj.parents('form').find('.qty').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/confirm' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				coupon: $.trim($obj.parents('form').find('.coupon').val()),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/coupon/info' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				couponCode: $obj.parents('form').find('.couponCode').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/order/summary/month' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				year: $obj.parents('form').find('.year').val(),
				month: $obj.parents('form').find('.month').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}


	});

});