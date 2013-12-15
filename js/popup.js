var windowGap = 25;
var mobileWidth;
var mobileHeight;
var mobileAgent;
var mobileLeft;
var mobileWindowID;

var desktopWidth;
var desktopWidth;
var desktopHeight;

var curTabID;

document.body.onclick= function(e){
	if(e.target.tagName === "LI" ) {
		deviceChosen(e.target);
	}
}

function deviceChosen(clicked) {
	mobileWidth = clicked.getAttribute( 'data-width' );
	mobileHeight = clicked.getAttribute( 'data-height' );
	mobileAgent = clicked.getAttribute( 'data-agent' );
	mobileLeft = screen.width - mobileWidth;
	desktopWidth = ( screen.width - mobileWidth ) - windowGap;
	desktopHeight = screen.height;

	chrome.windows.getCurrent(function(window) {
		chrome.tabs.getSelected(null,function( tab ) {
			var curURL = tab.url;
			curTabID = tab.id;
			var currentWindowOptions = {
				left : 0,
				top : 0,
				state : 'normal',
				width: parseInt(desktopWidth),
				height: parseInt(desktopHeight)
			}

			chrome.windows.update( window.id, currentWindowOptions );

			var newWindowOptions = {
				url : curURL,
				width : parseInt(mobileWidth),
				height : parseInt(mobileHeight),
				left : parseInt(mobileLeft),
				top : 0
			};
			chrome.tabs.executeScript( curTabID, { file : 'js/DOMWatcher.js' } );
			chrome.extension.sendMessage( { msgMode : "newWindow", "newWindowOptions" : newWindowOptions, 'mobileAgent' : mobileAgent } );
		} );
	} );
}