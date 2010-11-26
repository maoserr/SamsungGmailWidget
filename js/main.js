/**
 * This simple RSS reader parses the result of the XMLHttpRequest
 * and populates a list of article titles.  Click on a title
 * displays the description, with a button to display the entire article
 * in the browser.  
 * 
 * Elements added to the item list have an _articleNumber property
 * to tie them to our gArticle array.  Elements added to the viewer
 * have a _link property so that we don't have to keep around the
 * current selection.
 * 
 * gUrl is the RSS feed URL used in widget. 
 * Here are some additional URLs for experimentation.
 * Yahoo! Top Stories - http://rss.news.yahoo.com/rss/topstories 
 * ESPN Headlines - http://sports.espn.go.com/espn/rss/news
 * New York Times World - http://feeds.nytimes.com/nyt/rss/World
 * 
 * TODO:
 * 1. add timeout/retry to XMLHttpRequest
 * 2. add properties and UI for refresh rate
 * 3. add an update now function
 * 4. display errors rather than using alert
 * 5. handle scrolling
 */
var gUrl = 'https://mail.google.com/mail/feed/atom/';

var user;
var pw;
var interval;
var savepw;

/**
 * Holds an array of messages
 */
var gMsgs;

function savePrefs(){
	user = document.getElementById('user').value;
	pw = document.getElementById('pw').value;
	interval = parseFloat(document.getElementById('interval').value);
	savepw = document.getElementById('savepw').value;
	if( !isNaN(interval) && interval > 0 )
		setInterval('loadMessages();',60*1000*interval);
	loadMessages();
}

/**
 * Constructor for message object
 */
function Message(title,summary,link,modified,issued,id,author,email) {
	this.title = title;
	this.summary = summary;
	this.link = link;
	this.modified = modified;
	this.issued = issued;
	this.id = id;
	this.author = author;
	this.email = email;
}

/**
 * appInit is called from index.html when the html content has 
 * been loaded. It initializes the application state, 
 * makes sure the appropriate content is visible, and loads the data.
 */
function appInit() {
	
}

function loadMessages(){
	showList();
	document.getElementById('title').innerText = "Retrieving emails...";
	requestXML(gUrl, iterateXML, showStatus,user,pw);
}

/**
 * Show the article list
 */
function showList() {
	hide('viewer');
	hide('initial_setup');
	show('list');
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
 * Show an error alert with error message
 * 
 * @param text
 *            status message
 */
function showStatus(text) {
	alert(text);
}

/**
 * Given a currently selected article, open the associated story URL
 */
function openStoryURL() {
	openURL(document.getElementById('content')._link);
}

/**
 * Iterate the xml document. For each item in the RSS document, create an
 * Article object, and adds that Article to our article list display
 * 
 * @param xmlDoc
 *            an xml document
 */
function iterateXML(xmlDoc) {
	var title = xmlDoc.getElementsByTagName('fullcount').item(0).firstChild.data;
	document.getElementById('title').innerHTML = title + " unread";

	var items = xmlDoc.getElementsByTagName('entry');

	gMsgs = new Array();
	for ( var i = 0; i < items.length; i++) {
		var itemTitle = items[i].getElementsByTagName('title').item(0).firstChild.data;
		var itemSummary = items[i].getElementsByTagName('summary').item(0).firstChild.data;
		var itemLink = items[i].getElementsByTagName('link').item(0).getAttribute('href');
		var itemModified = items[i].getElementsByTagName('modified').item(0).firstChild.data;
		var itemIssued = items[i].getElementsByTagName('issued').item(0).firstChild.data;
		var itemId = items[i].getElementsByTagName('id').item(0).firstChild.data;
		var itemAuthor = items[i].getElementsByTagName('name').item(0).firstChild.data;
		var itemEmail = items[i].getElementsByTagName('email').item(0).firstChild.data;
		gMsgs[i] = new Message(itemTitle, itemSummary,itemLink,itemModified,itemIssued,
				itemId,itemAuthor,itemEmail);
	}

	var container = document.getElementById('list');
	container.removeChild(document.getElementById('itemList'));
	var itemList = document.createElement('div');
	itemList.id = 'itemList';
	for ( var i = 0; i < gMsgs.length; i++) {
		var anItem = document.createElement('li');
		anItem.id = 'item';
		anItem._articleNumber = i;
		// IE does not support addEventListener...
		try {
			anItem.addEventListener('click', clickHandler, false);
		}
		catch (e) {
			anItem.attachEvent('onclick', clickHandler);
		}
		var title = document.createTextNode(gMsgs[i].title);
		anItem.appendChild(title);
		anItem.appendChild(document.createElement('hr'));
		itemList.appendChild(anItem);
	}
	container.appendChild(itemList);
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
