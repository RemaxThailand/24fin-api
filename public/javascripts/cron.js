$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		/*if ( url == '/cron/telnet' ) {
			$.post($('#api_url').val()+url, {
				server: $obj.parents('form').find('.server').val(),
				port: $obj.parents('form').find('.port').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}*/


	});

});