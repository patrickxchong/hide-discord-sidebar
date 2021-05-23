// Promisefy Chrome functions
function getState(query) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(query, function (result) {
      resolve(result);
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

function executeScript(script) {
  return new Promise((resolve, reject) => {
    chrome.tabs.executeScript({
      code: script
    }, function (results) {
      resolve(results);
    });
  });
}

MicroModal.init();

function ComponentHDS() {
  return {
    state: {
      active: true,
      servers: "server-autohide",
      channels: "channel-autohide",
      smallWindowWidth: 700
    },
    inputWindowWidth: 700,
    parentWindowWidth: 0,
    async created() {
      let state = await getState(null);
      console.log(state);
      this.state = state;
      this.inputWindowWidth = this.state.smallWindowWidth;
      this.$watch('state.servers', async value => {
        await sendMessage({ action: "update", state: this.state });
      });
      this.$watch('state.channels', async value => {
        await sendMessage({ action: "update", state: this.state });
      });
    },
    async toggleActive() {
      this.state.active = !this.state.active;
      await sendMessage({ action: "update", state: this.state });
    },
    async openOptionsModal() {
      let results = await executeScript("window.innerWidth");
      this.parentWindowWidth = results[0];
      this.inputWindowWidth = this.state.smallWindowWidth;
      MicroModal.show("options-modal");
    },
    async saveOptions() {
      this.state.smallWindowWidth = this.inputWindowWidth;
      await sendMessage({ action: "update", state: this.state });
      MicroModal.close("options-modal");
    }
  };
}