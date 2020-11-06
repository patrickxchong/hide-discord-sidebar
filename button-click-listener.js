// Enable/disable extension when extension button is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, { toggleExtension: true });
});