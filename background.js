chrome.runtime.onInstalled.addListener(function(){
	chrome.storage.sync.set({PassGenLength: "17"});
	chrome.storage.sync.set({PassGenNumbers: true});
	chrome.storage.sync.set({PassGenSymbols: true});
	chrome.storage.sync.set({PassGenUppercase: true});
	chrome.tabs.create({url: "options.html"});
});