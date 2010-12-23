function appInit() {
	document.getElementById('title').innerText = "Settings";
}

function saveSettings(){
	switchWin('list');
	loadMessages();
}

function loadMessages(){
	document.getElementById('footer').innerText = "Retrieving emails...";
	// reset status for all
	for( var i in gAccts )
		gAccts[i].status = 0;
	for( var i in gAccts )
		gAccts[i].update();
}

/**
 * Show the article viewer
 * 
 * @param which
 *            the index into gArticles of article to view
 * @return
 */
function showViewer(which) {
	if (which < gMsgs.length) {
		var element = document.getElementById('content');
		element.style.display = 'block';
		element.innerHTML = "<b>" + gMsgs[which].title + "</b><br/>" + gMsgs[which].summary;
		element._link = gMsgs[which].link;
	}
	hide('list');
	show('viewer');
}

/**
 * Given a currently selected article, open the associated story URL
 */
function openStoryURL() {
	openURL(document.getElementById('content')._link);
}

function updateLists(){
	var itemList = document.getElementById('itemList');
	for( var i in gAccts){
		gAccts[i].createItems(itemList,i);
	}
}

/**
 * Handle a click on an article item.
 * Here we need to navigate some browser inconsistencies.
 * Some browsers don't pass the event, and use srcElement rather than target.
 * @see http://www.quirksmode.org/js/events_properties.html
 * 
 * @param e
 *            click event
 */
function clickHandler(e) {
	if (!e) {
		var e = window.event;
	}
	var element;
	if (e.target) {
		element = e.target;
	}
	else if (e.srcElement) {
		element = e.srcElement;
	}
	if (element) {
		showViewer(element._articleNumber);
	}
}
