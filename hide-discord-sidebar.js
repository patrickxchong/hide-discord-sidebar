function hideDiscordSidebar() {
  /* SERVERS */
  const guildsWrapper = document.getElementsByClassName('guildsWrapper-5TJh6A')[0]
    || document.getElementsByClassName('wrapper-1Rf91z')[0];
  const app = document.getElementsByClassName('base-3dtUhz')[0];

  const btn = document.createElement("BUTTON");
  const t = document.createTextNode("Hide Servers");
  btn.appendChild(t);
  btn.id = "hideNshow";

  btn.onclick = function () {
    if (guildsWrapper.style.display === 'none') {
      showServers();
    } else {
      hideServers();
    }
  };
  document.body.appendChild(btn);

  window.onresize = function () {
    // only if extension is active
    if (document.body.classList.contains("hide-dis-bar")) {
      if (window.innerWidth < 700) {
        hideServers();
      } else {
        showServers();
      }
    }
  };

  // initialize extension in page (response handled by onMessage handler below)
  chrome.runtime.sendMessage({ action: "initialize" });

  chrome.runtime.onMessage.addListener(function (request) {
    if (request.active) {
      document.body.classList.add("hide-dis-bar");
      // hide servers by default when screen width is small
      if (window.innerWidth < 700) {
        hideServers();
      }
    } else {
      document.body.classList.remove("hide-dis-bar");
      showServers(); // force show servers list (if it's hidden) when extension is disabled
    }
  });

  function hideServers() {
    guildsWrapper.style.display = 'none';
    app.style.left = 0;
    btn.innerHTML = "Show Servers";
  }

  function showServers() {
    guildsWrapper.style.display = 'flex';
    app.style.left = "72px";
    btn.innerHTML = "Hide Servers";
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

// document.addEventListener('DOMContentLoaded', hideDiscordSidebar, false);
// alternative to DOMContentLoaded
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    // Check that the Discord page contains the base chat element
    if(document.getElementsByClassName('base-3dtUhz')[0]) {
      hideDiscordSidebar();
    }
  }
};