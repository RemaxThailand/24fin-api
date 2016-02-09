$(function() {

	$(document).on('click', '.btn-submit', function(){
		var $obj = $(this);
		$obj.button('loading');
		$obj.parents('.panel-collapse').find('.result').removeClass('hidden').hide();
		var url = $obj.parents('.panel-collapse').find('pre').html().replace('URL : ', '');

		if ( url == '/product/all' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/category' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/brand' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/category_and_brand' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/sku/active' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/image/update' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
				product: $obj.parents('form').find('.product').val(),
				path: $obj.parents('form').find('.path').val(),
				bytes: $obj.parents('form').find('.bytes').val(),
				modified: $obj.parents('form').find('.modified').val(),
				modifier: $obj.parents('form').find('.modifier').val(),
				system: $obj.parents('form').find('.system').val(),
				mineType: $obj.parents('form').find('.mineType').val(),
				revision: $obj.parents('form').find('.revision').val(),
				size: $obj.parents('form').find('.size').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/image/list' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
				sku: $obj.parents('form').find('.sku').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/image/cover' ) {
			$.post($('#api_url').val()+url, {
				authKey: $obj.parents('form').find('.authKey').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/category/url' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
				url: $obj.parents('form').find('.url').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}
		else if ( url == '/product/info/id' ) {
			$.post($('#api_url').val()+url, {
				shop: $obj.parents('form').find('.shop').val(),
				id: $obj.parents('form').find('.id').val(),
			}, function(data){ showData($obj, data) }, 'json');
		}

	});

});