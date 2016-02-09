$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/system/data/screen' ) {
			$.post($('#api_url').val()+url, {
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/system/data/screen_mapping' ) {
			$.post($('#api_url').val()+url, {
				system: $obj.parents('form').find('.system').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/system/server/status' ) {
			$.post($('#api_url').val()+url, {
				server: $obj.parents('form').find('.server').val(),
				port: $obj.parents('form').find('.port').val(),
				status: $obj.parents('form').find('.status').val(),
				updateBy: $obj.parents('form').find('.updateBy').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}


	});

});