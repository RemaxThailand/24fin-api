$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/master/thailand/province' ) {
			$.post($('#api_url').val()+url, {
				language: $obj.parents('form').find('.language').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/master/thailand/district' ) {
			$.post($('#api_url').val()+url, {
				language: $obj.parents('form').find('.language').val(),
				provinceCode: $obj.parents('form').find('.provinceCode').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}


	});

});