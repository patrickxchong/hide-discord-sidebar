// Alert scripts on Discord tabs and update extension icon 
function updateDiscordTabs(state) {
  console.log("updateDiscordTabs")
  chrome.tabs.query({ url: "*://*.discord.com/*" }, (tabs) => {
    tabs.forEach((tab) => updateDiscordTab(state, tab.id));
  });
}

function updateDiscordTab(state, tabId) {
  console.log("updateDiscordTab")
  chrome.tabs.sendMessage(tabId, state);
  if (state.active) {
    chrome.action.setIcon({ tabId, path: "icons/icon128-active.png" });
  } else {
    chrome.action.setIcon({ tabId, path: "icons/icon128-inactive.png" });
  }
}

// Initialize extension status on client when requested
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "update") {
    chrome.storage.local.set(request.state);
    updateDiscordTabs(request.state);
    sendResponse({ success: true });
  }
  else if (request.action === "silent-update") {
    chrome.storage.local.set(request.state);
    sendResponse({ success: true });
  }
  return true;
});

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async function (details) {
  // Initialize default state
  let state = await getState({
    active: true,
    showServers: true,
    servers: "server-autohide",
    channels: "channel-hide",
    smallWindowWidth: 750
  });
  await setState(state);
  console.table(state);

  if (details.reason == "install") {
    console.log("[Hide Discord Sidebar] First install");
    // Refresh Discord pages on first install
    chrome.tabs.query({ url: "*://*.discord.com/*" }, function (tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.reload(tab.id);
      });
    });
  } else if (details.reason == "update") {
    const thisVersion = chrome.runtime.getManifest().version;
    console.log("[Hide Discord Sidebar] Updated from " + details.previousVersion + " to " + thisVersion + "!");
    chrome.tabs.query({ url: "*://*.discord.com/*" }, (tabs) => {
      tabs.forEach((tab) => {
        if (state.active) {
          chrome.action.setIcon({ tabId: tab.id, path: "icons/icon128-active.png" });
        } else {
          chrome.action.setIcon({ tabId: tab.id, path: "icons/icon128-inactive.png" });
        }
        chrome.action.enable(tab.id);
      });
    });

  }
});


// https://stackoverflow.com/questions/21881627/content-scripts-not-trapping-chrome-tabs-onupdate
// https://stackoverflow.com/questions/33770825/get-previous-url-from-chrome-tabs-onupdated
// This listener is required to update Discord tab when a person goes from https://discord.com/ (or other Discord non-app pages) to the Discord webapp itself
const tabIdToPreviousUrl = {};
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.match(/discord\.com/)) {
    let previousUrl = tabIdToPreviousUrl[tabId] || "";

    // If the url is different, perform action
    if (previousUrl !== tab.url && !previousUrl.match(/(channels|store|guild-discovery)/)) {
      // do something
      let state = await getState(null);
      updateDiscordTab(state, tabId);
      chrome.action.enable(tabId);
    }
    // Add the current url as previous url
    tabIdToPreviousUrl[tabId] = tab.url;
  } else if (changeInfo.status === 'complete') {
    chrome.action.disable(tabId);
  }
});

chrome.tabs.onCreated.addListener(async function (tab) {
  if (tab.url && tab.url.match(/discord\.com/)) {
    let state = await getState(null);
    updateDiscordTab(state, tab.id);
    chrome.action.enable(tab.id);
  } else if (tab.url) {
    chrome.action.disable(tab.id);
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  delete tabIdToPreviousUrl[details.tabId];
})

chrome.tabs.onRemoved.addListener(function (tabId) {
  delete tabIdToPreviousUrl[tabId];
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
