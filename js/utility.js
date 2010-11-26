/**
 * resizeWindow - resize the current widget window 
 * SHP provides a widget.window.resizeWindow, but WM does not, 
 * so we attempt to do a resizeWindow and fall back to resizeTo.
 * 
 * @param width
 *            desired width of window
 * @param height
 *            desired height of window
 */
function resizeWindow(width, height) {
	try {
		widget.window.resizeWindow(width, height);
	}
	catch (e) {
		window.resizeTo(width, height);
	}
}

/**
 * resizeWindow to fit the specified element
 * This function uses style information from the element so that
 * we don't hard code sizes in our JavaScript files.
 * @param id
 *            the id of main element
 */
function resizeWindowToFit(id) {
	var container = document.getElementById(id);
	resizeWindow(container.offsetWidth, container.offsetHeight);
}

/**
 * Show a document element
 * 
 * @param id
 *            the id of the element to show
 */
function show(id) {
	document.getElementById(id).style.display = "block";
}

/**
 * Hide a document element
 * 
 * @param id
 *            of the element to hide
 */
function hide(id) {
	document.getElementById(id).style.display = "none";
}

/**
 * Open the specified url Attempt to use widget.openURL, 
 * but fall back to using window.open
 * 
 * @param url
 *            the URL to open
 */
function openURL(url) {
	try {
		widget.openURL(url);
	}
	catch (e) {
		window.open(url, "newWindow");
	}
}

/**
 * @return true if network is available (using getIsNetworkAvailable)
 */
function isNetworkAvailable() {
	try {
		return widget.sysInfo.network.getIsNetworkAvailable();
	}
	catch (e) {
		return true;
	}
}
