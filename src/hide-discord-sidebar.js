function hideDiscordSidebar() {
  // initialise default state
  let state = {
    active: false,
    showServers: true,
    channels: "channel-disable",
    servers: "server-disable",
    smallWindowWidth: "700",
  };

  // Select the server list element, which changes in some updates. 
  const guildsWrapper = document.getElementsByClassName('guildsWrapper-5TJh6A')[0]
    || document.getElementsByClassName('wrapper-1Rf91z')[0]
    || document.getElementsByClassName('wrapper-3NnKdC')[0]
    // General fallback to select the server list.
    || document.querySelector("nav[class*=wrapper-]");

  const btn = document.createElement("BUTTON");
  const t = document.createTextNode("Hide Servers");
  btn.appendChild(t);
  btn.id = "hds-btn";
  btn.onclick = function () {
    if (guildsWrapper.style.display === 'none') {
      showServers();
    } else {
      hideServers();
    }
  };
  document.body.appendChild(btn);


  let timeout = false; // holder for timeout id
  window.addEventListener('resize', function () {
    clearTimeout(timeout);
    timeout = setTimeout(resizeHandler, 250);
  });

  function resizeHandler() {
    // only if extension is active
    if (state.active) {
      if (state.servers == "server-autohide") {
        if (window.innerWidth <= state.smallWindowWidth) {
          hideServers();
        } else {
          showServers();
        }
      }
      if (state.channels == "channel-autohide") {
        document.body.classList.toggle("channel-hide", window.innerWidth < state.smallWindowWidth);
      }
    }
  }

  // initialize extension in page (response handled by onMessage handler below)
  chrome.runtime.sendMessage({ action: "initialize" });

  chrome.runtime.onMessage.addListener(function (request) {
    state = request;
    console.log(state);

    document.body.classList.toggle("hide-dis-bar", state.active);
    document.body.classList.toggle("channel-hide", state.channels == "channel-hide");

    if (state.active && state.servers == "server-disable" && state.showServers == false) {
      hideServers(false);
    } else {
      showServers(false);
    }

    resizeHandler();
  });

  function hideServers(updateBackend = true) {
    guildsWrapper.style.display = 'none';
    btn.innerHTML = "Show Servers";
    if (updateBackend) {
      state.showServers = false;
      sendMessage({ action: "silent-update", state });
    }
  }

  function showServers(updateBackend = true) {
    guildsWrapper.style.display = 'flex';
    btn.innerHTML = "Hide Servers";
    if (updateBackend) {
      state.showServers = true;
      sendMessage({ action: "silent-update", state });
    }
  }

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

  console.log('%c Hide Discord Sidebar extension activated ', styles);
}

// DOMContentLoaded and load events don't work 
// https://developer.mozilla.org/en-US/docs/Web/API/Document/readystatechange_event
document.addEventListener('readystatechange', function () {
  if (document.readyState === "complete") {
    // Check that the Discord page contains the base chat element
    if (document.getElementsByClassName('base-3dtUhz')[0]) {
      hideDiscordSidebar();
    }
  }
});

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, function (result) {
      resolve(result);
    });
  });
}