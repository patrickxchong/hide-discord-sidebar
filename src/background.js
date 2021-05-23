// Alert scripts on Discord tabs and update extension icon 
function updateDiscordTabs(state) {
  console.log(state);
  chrome.tabs.query({ url: "*://*.discord.com/*" }, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.sendMessage(tab.id, state);

      if (state.active) {
        chrome.pageAction.setIcon({ tabId: tab.id, path: "icons/icon128-active.png" });
      } else {
        chrome.pageAction.setIcon({ tabId: tab.id, path: "icons/icon128-inactive.png" });
      }
    });
  });
}

// Initialize extension status on client when requested
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "initialize") {
    let state = await getState(null);
    updateDiscordTabs(state);
  }
  else if (request.action === "update") {
    chrome.storage.local.set(request.state);
    updateDiscordTabs(request.state);
    sendResponse({ success: true });
  }
  return true;
});

// Promisefy Chrome functions
function getState(query) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(query, function (result) {
      resolve(result);
    });
  });
}

function setState(data) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(data, function () {
      resolve(data);
    });
  });
}

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async function (details) {
  // Initialize default state
  let state = await getState({
    active: true,
    servers: "server-autohide",
    channels: "channel-autohide",
    smallWindowWidth: 600
  });
  await setState(state);
  console.table(state);

  if (details.reason == "install") {
    console.log("[Hide Discord Sidebar] First install");
    // Refresh Discord pages on first install
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

// Enable action only on discord.com pages (causes extension icon have "disabled" look on other pages)
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