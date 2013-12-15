window.onscroll = function( event ) {
	chrome.extension.sendMessage( { msgMode : "scroll", scrollValue : document.body.scrollTop } );
}