function ParseParam() {
	var params = [];
	var url = window.location.toString();
	var idxOfParam = url.indexOf('?');
	if (idxOfParam > -1) {
		var paramList = url.substring(idxOfParam + 1);
		var splits = paramList.split('&');
		for (var i = 0; i < splits.length; ++i) {
			var token = splits[i];
			var pairs = token.split('=');
			if (pairs.length > 1) {
				//console.log('pairs[0]='+pairs[0].toLowerCase());
				params[pairs[0]] = pairs[1];
			}
		}
	}
	return params;
}