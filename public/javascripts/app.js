$(function() {

	$(document).on('click', '.btn-submit', function(){
		$('.btn-collapse').remove();
		$('.btn-expand').remove();
		$('.btn-toggle').remove();
	});

	$(document).on('click', '.btn-collapse', function(){
		$(this).parent().find('.result').JSONView('collapse');
	});

	$(document).on('click', '.btn-expand', function(){
		$(this).parent().find('.result').JSONView('expand');
	});

	$(document).on('click', '.btn-toggle', function(){
		$(this).parent().find('.result').JSONView('toggle');
	});

});

function showData($obj, data){
	//$obj.parents('.panel-collapse').find('.result').html('<b>Result</b> : '+JSON.stringify(data)).show();
	//$("#json").JSONView(json);
	var $dv = $obj.parents('.panel-collapse').find('.result');
	$dv.JSONView(data, {collapsed: true}).show();
	$dv.before('<span class="btn btn-xs btn-default margin-top-10 btn-collapse">Collapse</span> <span class="btn btn-xs btn-default margin-top-10 btn-expand">Expand</span> <span class="btn btn-xs btn-default margin-top-10 btn-toggle">Toggle</span>');
	$obj.button('reset');
}