const HDS = {
  state: {},
  $refs: {
    guildsWrapper: null,
    btn: null,
  },
  stateChangeHandler(state) {
    try {
      this.state = Object.assign({}, state);
      document.body.classList.toggle("hide-dis-bar", this.state.active);
      document.body.classList.toggle("channel-hide", this.state.channels == "channel-hide");

      if (this.state.active && this.state.servers == "server-disable" && this.state.showServers == false) {
        this.hideServers(false);
      } else {
        this.showServers(false);
      }
      this.resizeHandler();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  getServers() {
    // Select the server list element, which changes in some updates. 
    const guildsWrapper = document.getElementsByClassName('guildsWrapper-5TJh6A')[0]
      || document.getElementsByClassName('wrapper-1Rf91z')[0]
      || document.getElementsByClassName('wrapper-3NnKdC')[0]
      // General fallback to select the server list.
      || document.querySelector("nav[class*=wrapper-]")
      || document.querySelector("nav[class*=guilds]")
      || document.querySelector("nav[aria-label*='Servers sidebar']");
    return guildsWrapper;
  },
  init() {
    const styles = [
      'background: linear-gradient(#D33106, #571402)'
      , 'border: 1px solid #3E0E02'
      , 'color: white'
      , 'display: block'
      , 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)'
      , 'background-image: linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      , 'line-height: 40px'
      , 'text-align: center'
      , 'font-weight: bold'
      , 'font-size: 18px'
    ].join(';');

    console.log('%c Hide Discord Sidebar extension initialising ', styles);

    let guildsWrapper = this.getServers();

    if (!guildsWrapper) {
      // console.log("not a discord chat page");
      return false;
    }

    if (document.getElementById("hds-btn")) {
      // console.log("already initialised");
      return true;
    }

    const btn = document.createElement("BUTTON");
    const t = document.createTextNode("Hide Servers");
    btn.appendChild(t);
    btn.id = "hds-btn";
    btn.onclick = () => {
      guildsWrapper = this.getServers();
      if (guildsWrapper.style.display === 'none') {
        this.showServers();
      } else {
        this.hideServers();
      }
    };
    document.body.appendChild(btn);

    this.$refs.btn = btn;

    let timeout = false; // holder for timeout id
    window.addEventListener('resize', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.resizeHandler();
      }, 250);
    });

    console.log('%c Hide Discord Sidebar extension activated ', styles);
    return true;
  },
  resizeHandler() {
    // only if extension is active
    if (this.state.active) {
      if (this.state.servers == "server-autohide") {
        if (window.innerWidth <= this.state.smallWindowWidth) {
          this.hideServers();
        } else {
          this.showServers();
        }
      }
      if (this.state.channels == "channel-autohide") {
        document.body.classList.toggle("channel-hide", window.innerWidth <= this.state.smallWindowWidth);
      }
    }
  },

  hideServers(updateBackend = true) {
    this.getServers().style.display = 'none';
    this.$refs.btn.innerHTML = "Show Servers";
    if (updateBackend) {
      this.state.showServers = false;
      this.sendMessage({ action: "silent-update", state: this.state });
    }
  },

  showServers(updateBackend = true) {
    this.getServers().style.display = 'flex';
    this.$refs.btn.innerHTML = "Hide Servers";
    if (updateBackend) {
      this.state.showServers = true;
      this.sendMessage({ action: "silent-update", state: this.state });
    }
  },

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, function (result) {
        resolve(result);
      });
    });
  }
};

chrome.runtime.onMessage.addListener(function (state) {
  let initialised = false;
  let timer = setInterval(function () {
    if (!initialised) {
      initialised = HDS.init(state);
    }
    
    if (initialised) {
      let handlerSuccess = HDS.stateChangeHandler(state);
      if (handlerSuccess) {
        clearInterval(timer);
      }
    }
  }, 200);
});


// DOMContentLoaded and load events don't work
// https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
// document.addEventListener('readystatechange', function () {
//   if (document.readyState === "complete") {
//     // Check that the Discord page contains the base chat element
//     if (document.getElementsByClassName('base-3dtUhz')[0]) {
//       hideDiscordSidebar();
//     }
//   }
// });
