$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/shop/config/add' ) {
			$.post($('#api_url').val()+url, {
				shopId: $obj.parents('form').find('.shopId').val(),
				configKey: $obj.parents('form').find('.configKey').val(),
				configValue: $obj.parents('form').find('.configValue').val(),
				configType: $obj.parents('form').find('.configType').val(),
				memberId: $obj.parents('form').find('.memberId').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/shop/info/barcode' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				sellNo: $obj.parents('form').find('.sellNo').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/shop/customer/list' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}


	});

});