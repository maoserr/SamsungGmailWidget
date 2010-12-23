function resizeWindow(width, height) {
	try {
		widget.window.resizeWindow(width, height);
	}
	catch (e) {
		window.resizeTo(width, height);
	}
}

function resizeWindowToFit(id) {
	var container = document.getElementById(id);
	resizeWindow(container.offsetWidth, container.offsetHeight);
}

function show(id) {
	document.getElementById(id).style.display = "block";
}

function hide(id) {
	document.getElementById(id).style.display = "none";
}

function switchWin(id){
	var wins = ['list','viewer','settings','add_acct'];
	for( var i in wins ){
		if( id != wins[i] )
			hide(wins[i]);
	}
	show(id);
}

function scroll(win,dir){
	var step = 5;
	switch(dir){
	case 'up':
		document.getElementById(win).scrollTop-=step;
		break;
	case 'down':
		document.getElementById(win).scrollTop+=step;
		break;
	}
}

function openURL(url) {
	try {
		widget.openURL(url);
	}
	catch (e) {
		window.open(url, "newWindow");
	}
}

function isNetworkAvailable() {
	try {
		return widget.sysInfo.network.getIsNetworkAvailable();
	}
	catch (e) {
		return true;
	}
}

function getXMLHttpRequest() {
	var xmlHttp = null;
	try {
		xmlHttp = new XMLHttpRequest();
	}catch (e) {
		try {xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");}
		catch (e) {}
	}
	return xmlHttp;
}

