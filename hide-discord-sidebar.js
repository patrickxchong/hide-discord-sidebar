function hideDiscordSidebar() {
  /* SERVERS */
  const guildsWrapper = document.getElementsByClassName('guildsWrapper-5TJh6A')[0]
    || document.getElementsByClassName('wrapper-1Rf91z')[0];
  const app = document.getElementsByClassName('base-3dtUhz')[0];

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

  const popup = document.createElement("div");
  popup.innerHTML = `
  <p><b style="font-weight: 600;">Hide Discord Sidebar</b> is disabled. You can enable it by clicking on the extension icon.</p>
  <svg class="closeIcon-2eaC4U" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
  `;
  popup.id = "hds-popup";
  popup.onclick = function () {
    togglePopup(false);
  };
  document.body.appendChild(popup);

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
      togglePopup(false);
      document.body.classList.add("hide-dis-bar");
      // hide servers by default when screen width is small
      if (window.innerWidth < 700) {
        hideServers();
      }
    } else {
      document.body.classList.remove("hide-dis-bar");
      togglePopup(true);
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

  function togglePopup(active) {
    if (active) {
      popup.style.display = "flex";
    } else {
      popup.style.display = "none";
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