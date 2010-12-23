var gAccts = [];
var gMarkers = ['bullet_black.png','bullet_blue.png','bullet_green.png',
            	'bullet_orange.png','bullet_pink.png','bullet_purple.png','bullet_red.png'];
var ACTTYPE = {	GMAIL:0,
				READER:1};
var ACTNAME=['Gmail','Reader'];
var STAT = {	UNINIT:		0,
				OPENED:		1,
				SENT:		2,
				RECEIVING:	3,
				COMPLETE:	4,
				AUTHERR:	5,
				NONET:		6,
				ERR:		100
		};
/**
 * Constructor for a GMail message object
 */
function MailMsg(title,summary,link,modified,
		issued,id,author,email) {
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
 * Constructor for Gmail account object
 */
function MailAccount(name,user,pw,
		label,savepw,marker){
	this.name = name;
	this.user = user;
	this.pw = pw;
	this.label = label;
	this.savepw = savepw;
	this.marker = marker;
	this.type = ACTTYPE.GMAIL;
	this.msgs = [];
	this.status = 0;
	this.errmsg = "";
}

MailAccount.prototype.url = 'https://mail.google.com/mail/feed/atom/';

MailAccount.prototype.update = function (){
	var curracct = this;
	var req = getXMLHttpRequest();
	if (isNetworkAvailable() && req){
		try{
			try {netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			}catch (e) {}
			req.open('GET', this.url, true,this.user,
					this.pw);
			req.setRequestHeader("Content-type", "text/xml");
			req.onreadystatechange = function() {
				if (req.readyState != 4) {
					curracct.status = req.readyState;
					return;
				}
				if (req.status == 200) {
					curracct.parse(req.responseXML);
					curracct.status = STAT.COMPLETE;
					// check if all completed
					updateLists();
				}
				else if (req.status == 401 ){
					curracct.status = STAT.AUTHERR;
				}
				else {
					curracct.status = STAT.ERR;
					curracct.errmsg = req.statusText;
				}
			};
			req.send(null);
		}catch (e) {
			this.status = STAT.ERR;
			this.errmsg = "Unable to make request";
		}
	}else{
		this.status = STAT.NONET;
	}
};
MailAccount.prototype.parse = function(xml){
	var items = xml.getElementsByTagName('entry');
	this.msgs = [];
	for ( var i=0; i < items.length; i++ ) {
		var itemTitle = items[i].getElementsByTagName('title').item(0).firstChild.data;
		var itemSummary = items[i].getElementsByTagName('summary').item(0).firstChild.data;
		var itemLink = items[i].getElementsByTagName('link').item(0).getAttribute('href');
		var itemModified = items[i].getElementsByTagName('modified').item(0).firstChild.data;
		var itemIssued = items[i].getElementsByTagName('issued').item(0).firstChild.data;
		var itemId = items[i].getElementsByTagName('id').item(0).firstChild.data;
		var itemAuthor = items[i].getElementsByTagName('name').item(0).firstChild.data;
		var itemEmail = items[i].getElementsByTagName('email').item(0).firstChild.data;
		this.msgs[i] = new MailMsg(itemTitle, itemSummary,itemLink,itemModified,itemIssued,
				itemId,itemAuthor,itemEmail);
	}
};

MailAccount.prototype.createItems = function(itemList,i){
	for( var j in this.msgs){
		var anItem = document.createElement('div');
		anItem.classname = 'item' + ACTNAME[this.type];
		anItem._actnum = i;
		anItem._msgnum = j;
		try {
			anItem.addEventListener('click', clickHandler, false);
		}
		catch (e) {
			anItem.attachEvent('onclick', clickHandler);
		}
		var title = document.createTextNode(this.msgs[j].title);
		var img = document.createElement('img');
		img.src = 'images/markers/' + this.marker;
		anItem.appendChild(img);
		anItem.appendChild(title);
		anItem.appendChild(document.createElement('hr'));
		itemList.appendChild(anItem);
	}
};

function cancelAcct(){
	document.getElementById('user').value = '';
	document.getElementById('pw').value = '';
	document.getElementById('label').value = '';
	document.getElementById('savepw').checked = false;
	switchWin('settings');
}

function getNextAvailMarker(){
	var marker;
	var markers = [];
	for( var i in gMarkers ){
		markers[i] = 0;
	}
	// Find an empty marker
	for( var i in gAccts ){
		for( var j in gMarkers ){
			if( gMarkers[j] == gAccts[i].marker ){
				markers[j]++;
				break;	
			}
		}
	}
	var minused = Math.min.apply(null, markers);
	for( var i in markers ){
		if( markers[i] == minused ){
			marker = gMarkers[i];
			break;
		}
	}
	return marker;	
}

function saveAcct(type){
	switch(type){
		case 'mail':
			var actname = document.getElementById('actname').value;
			var user = document.getElementById('user').value;
			var pw = document.getElementById('pw').value;
			var label = document.getElementById('label').value;
			var savepw = document.getElementById('savepw').checked;
			var acct = new MailAccount(actname,user,pw,label,savepw,getNextAvailMarker());
			break;
		default:
			switchWin('settings');
			return;
	}

	gAccts.push(acct);
	updateAcctList();
	switchWin('settings');
}

function updateAcctList(){
	var accts_list = document.getElementById('settings_accounts');
	while( accts_list.hasChildNodes() ){accts_list.removeChild(accts_list.firstChild);}
	for ( var i in gAccts ){
		var anAcct = document.createElement('div');
		var mark = document.createElement('img');
		mark.src = "images/markers/"+gAccts[i].marker;
		mark.className = 'acct_marker';
		var name = document.createTextNode(gAccts[i].name);
		anAcct.appendChild(mark);
		anAcct.appendChild(name);
		anAcct.appendChild(document.createElement('br'));
		accts_list.appendChild(anAcct);
	}
}