var intialised = false;
var mobileTabID;
var mobileAgent;

chrome.extension.onMessage.addListener( function( request, sender, sendResponse ){
	if( request.msgMode === 'newWindow' ){
		intialised = true;
		mobileAgent = request.mobileAgent;
		chrome.windows.create( request.newWindowOptions, function( newWindow ) {
			mobileWindowID = newWindow.id;
			chrome.tabs.getSelected(null,function( tab ) {
				mobileTabID = tab.id;
			} );
		} );
	}
	else if( request.msgMode === 'scroll'){
		chrome.tabs.executeScript( mobileTabID, { code : 'document.body.scrollTop = ' + request.scrollValue } );
	}
} );

chrome.tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {
	if( changeInfo.url && intialised ) {
		chrome.tabs.update( mobileTabID, { url : changeInfo.url } );
	}
} );

chrome.tabs.onRemoved.addListener( function( tabId ) {
	if( tabId === mobileTabID ) {
		initalised = false;
	}
} );

chrome.webRequest.onBeforeSendHeaders.addListener( function( details ) {
	if( details.tabId === mobileTabID && intialised ){
		for ( var i = 0; i < details.requestHeaders.length; ++i ) {
			if (details.requestHeaders[i].name === 'User-Agent') {
				details.requestHeaders[i].value = mobileAgent;
				break;
			}
		}
	}
	return { requestHeaders: details.requestHeaders };
	},
	{ urls: [ "<all_urls>" ] },
	[ "blocking", "requestHeaders" ]
);
