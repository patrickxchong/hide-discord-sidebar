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
    message = JSON.parse(JSON.stringify(message)); // prevent DataCloneError
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

function ComponentHDS() {
  return {
    state: {
      active: true,
      servers: "",
      channels: "",
      smallWindowWidth: 700
    },
    inputWindowWidth: 700,
    parentWindowWidth: 0,
    async created() {
      try {
        let state = await getState(null);
        console.log(state);
        this.state = state;
        document.getElementById(this.state.servers).checked = true;
        document.getElementById(this.state.channels).checked = true;
      } catch (e) { }

      this.inputWindowWidth = this.state.smallWindowWidth;
      this.toggleActive(this.state.active);

      let root = this;
      document.querySelector(".button-power").addEventListener("click", () => root.toggleActive());
      document.querySelector(".button-save").addEventListener("click", () => root.saveOptions());

      document.querySelectorAll(".icon-gear").forEach(item => {
        item.addEventListener("click", () => root.openOptionsModal());
      });
      document.querySelectorAll("[id*=server]").forEach(item => {
        item.addEventListener("click", async function () {
          root.state.servers = this.value;
          await sendMessage({ action: "update", state: root.state });
        });
      });
      document.querySelectorAll("[id*=channel]").forEach(item => {
        item.addEventListener("click", async function () {
          root.state.channels = this.value;
          await sendMessage({ action: "update", state: root.state });
        });
      });
    },
    async toggleActive(placeholder = 10) {
      // set placeholder value so that active is only toggled when no argument is provided
      if (placeholder === 10) {
        this.state.active = !this.state.active;
      }
      let buttonPower = document.querySelector(".button-power");
      if (this.state.active) {
        buttonPower.removeAttribute('inactive');
        document.querySelector(".button-power-text").innerText = "Enabled";
      } else {
        buttonPower.setAttribute('inactive', 'inactive');
        document.querySelector(".button-power-text").innerText = "Disabled";
      }
      await sendMessage({
        action: "update", state: this.state
      });
    },
    async toggleServers(value) {
      this.state.servers = value;
      await sendMessage({ action: "update", state: this.state });
    },
    async toggleChannels(value) {
      this.state.channels = value;
      await sendMessage({ action: "update", state: this.state });

    },
    async openOptionsModal() {
      let results = await executeScript("window.innerWidth");
      document.getElementById("parentWindowWidth").innerText = results[0];
      document.getElementById("inputWindowWidth").value = this.state.smallWindowWidth;
      MicroModal.show("options-modal");
    },
    async saveOptions() {
      this.state.smallWindowWidth = document.getElementById("inputWindowWidth").value;
      await sendMessage({ action: "update", state: this.state });
      MicroModal.close("options-modal");
    }
  };
}

MicroModal.init();
window.hds = ComponentHDS();
hds.created();