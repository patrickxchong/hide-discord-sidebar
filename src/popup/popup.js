// Promisefy Chrome functions
function readLocalStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      console.log(result);
      if (Object.values(result)[0] != undefined) {
        resolve(Object.values(result)[0]);
      } else {
        reject();
      }
    });
  });
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (result) {
      resolve(result);
    });
  });
}

function ComponentEnable() {
  return {
    enabled: true,
    async getState() {
      this.enabled = await readLocalStorage("active");
    },
    async enable() {
      this.enabled = true;
      await sendMessage({ action: "enable" });
    },
    async disable() {
      this.enabled = false;
      await sendMessage({ action: "disable" });
    },
  };
}

function ComponentRadioGroup() {
  return {
    openOptionsPage() {
      chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
    }
  }

}
