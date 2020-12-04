// Update extension icon and also inform opened Discord tabs about active status change
function updateDiscordTabs(result) {
  chrome.tabs.query({ url: "*://*.discord.com/*" }, function (tabs) {
    tabs.forEach(function (tab) {
      if (result.active) {
        chrome.pageAction.setIcon({ tabId: tab.id, path: "icons/icon128-active.png" });
      } else {
        chrome.pageAction.setIcon({ tabId: tab.id, path: "icons/icon128-inactive.png" });
      }
      chrome.tabs.sendMessage(tab.id, { active: result.active });
    });
  });
}

// Enable/disable extension when extension button is clicked
chrome.pageAction.onClicked.addListener(function (tab) {
  // Only run pageAction when url matches https://discord.com
  if (tab.url && tab.url.match(/https:\/\/discord.com/g)) {
    chrome.storage.local.get({ "active": true }, function (result) {
      // toggle active status
      result.active = !result.active;
      chrome.storage.local.set({ active: result.active });
      updateDiscordTabs(result);
    });
  }
});

// Initialize extension status on client when requested
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "initialize") {
    chrome.storage.local.get({ "active": true }, function (result) {
      updateDiscordTabs(result);
    });
    return true;
  }
});

// Initialize extension on install
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    console.log("[Hide Discord Sidebar] First install");
    // Set default active state and refresh Discord pages on first install
    chrome.storage.local.set({ active: true });
    chrome.tabs.query({ url: "*://*.discord.com/*" }, function (tabs) {
      tabs.forEach(function (tab) {
        chrome.tabs.reload(tab.id);
      });
    });
  } else if (details.reason == "update") {
    const thisVersion = chrome.runtime.getManifest().version;
    console.log("[Hide Discord Sidebar] Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});

// Enable PageAction only on discord.com pages
// The removeRules operation is performed because the rule will be added repeatedly every time the extension is refreshed.
chrome.declarativeContent.onPageChanged.removeRules(undefined, data => {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'discord.com', schemes: ['https'] },
        css: [".sidebar-2K8pFh"]
      }),
    ],
    actions: [
      new chrome.declarativeContent.ShowPageAction()
    ],
  }], data => {
    // addRules callback
  });
});