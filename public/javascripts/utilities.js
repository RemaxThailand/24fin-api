$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/utilities/telnet' ) {
			$.post($('#api_url').val()+url, {
				server: $obj.parents('form').find('.server').val(),
				port: $obj.parents('form').find('.port').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/sendmail' ) {
			$.post($('#api_url').val()+url, {
				to: $obj.parents('form').find('.to').val(),
				senderName: $obj.parents('form').find('.senderName').val(),
				senderEmail: $obj.parents('form').find('.senderEmail').val(),
				subject: $obj.parents('form').find('.subject').val(),
				message: $obj.parents('form').find('.message').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/email/verify' ) {
			$.post($('#api_url').val()+url, {
				email: $obj.parents('form').find('.email').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/data/insert' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				insertKey: $obj.parents('form').find('.insertKey').val(),
				table: $obj.parents('form').find('.table').val(),
				data: $obj.parents('form').find('.data').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/data/update' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				updateKey: $obj.parents('form').find('.updateKey').val(),
				table: $obj.parents('form').find('.table').val(),
				column: $obj.parents('form').find('.column').val(),
				value: $obj.parents('form').find('.value').val(),
				where: $obj.parents('form').find('.where').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/data/delete' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
				deleteKey: $obj.parents('form').find('.deleteKey').val(),
				table: $obj.parents('form').find('.table').val(),
				where: $obj.parents('form').find('.where').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/dropbox/share' ) {
			$.post($('#api_url').val()+url, {
				path: $obj.parents('form').find('.path').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/dropbox/search' ) {
			$.post($('#api_url').val()+url, {
				path: $obj.parents('form').find('.path').val(),
				query: $obj.parents('form').find('.query').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/dropbox/sync_image' ) {
			$.post($('#api_url').val()+url, {
				path: $obj.parents('form').find('.path').val(),
				query: $obj.parents('form').find('.query').val(),
				type: $obj.parents('form').find('.type').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/dropbox/get_public_path' ) {
			$.post($('#api_url').val()+url, {
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/utilities/database/add_ip' ) {
			$.post($('#api_url').val()+url, {
				system: $obj.parents('form').find('.system').val(),
				ip: $obj.parents('form').find('.ip').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}


	});

});