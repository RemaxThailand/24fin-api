exports.index = function(req, res, screen, script){
	var title = '';
	if (screen == 'index') {
		title = 'Home';
	} else if (screen == 'xxx') {
		title = 'xxx';
	} else {
		title = screen.toUpperCase();
	}

	res.render(screen, { config: config, title: title, script: script });
};