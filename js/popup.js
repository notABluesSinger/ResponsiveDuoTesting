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


$( document ).ready( function(){
	$( 'li' ).on( 'click', function(){
		mobileWidth = $( this ).data( 'width' );
		mobileHeight = $( this ).data( 'height' );
		mobileAgent = $( this ).data( 'agent' );
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
					width: desktopWidth,
					height: desktopHeight
				}

				chrome.windows.update( window.id, currentWindowOptions );

				var newWindowOptions = {
					url : curURL,
					width : mobileWidth,
					height : mobileHeight,
					left : mobileLeft,
					top : 0
				};
				chrome.tabs.executeScript( curTabID, { file : 'js/DOMWatcher.js' } );
				chrome.extension.sendMessage( { msgMode : "newWindow", "newWindowOptions" : newWindowOptions, 'mobileAgent' : mobileAgent } );
			} );
		} );
	} );
} );