function discordHack() {

  // When Discord chat is loaded
  // if (document.querySelector('.divider-2PMBlV').parentNode.childNodes.length == 7 || document.querySelector('.divider-2PMBlV').parentNode.childNodes.length == 4) {

  // Changed as of version 2.5 to be handled by CSS
  /* CHANNELS */
  // var channelPlaceholder = "3.5vmin";
  // var channelWidth = "40vmin";
  // var channels = document.getElementsByClassName('channels-Ie2l6A')[0];

  // channels.style.width = 0;
  // channels.style.paddingLeft = channelPlaceholder;

  // channels.addEventListener("mouseover", function() {
  //   channels.style.width = channelWidth;
  //   channels.style.paddingLeft = 0;
  // })

  // channels.addEventListener("mouseout", function() {
  //   channels.style.width = 0;
  //   channels.style.paddingLeft = channelPlaceholder;
  // })

  /* SERVERS */
  var guildsWrapper = document.getElementsByClassName('guildsWrapper-5TJh6A')[0]
    || document.getElementsByClassName('wrapper-1Rf91z')[0];

  var btn = document.createElement("BUTTON");
  var t = document.createTextNode("Hide Servers");
  btn.appendChild(t);
  btn.id = "hideNshow";

  btn.onclick = function() {
    if (
      guildsWrapper.style.display === 'none') {
      showServers();
    } else {
      hideServers();
    }
  }
  document.body.appendChild(btn)



  if (window.innerWidth < 700) {
    hideServers();
  }

  window.onresize = function() {
    if (window.innerWidth < 700) {
      hideServers();
    } else {
      showServers();
    }
  }

  function hideServers() {
    guildsWrapper.style.display = 'none';
    btn.innerHTML = "Show Servers"
  }

  function showServers() {
    guildsWrapper.style.display = 'flex';
    btn.innerHTML = "Hide Servers"
  }

  var styles = [
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
  // }
}

// var hider = setInterval(discordHack, 2000);
// document.addEventListener('DOMContentLoaded', discordHack, false);
// alternative to DOMContentLoaded
document.onreadystatechange = function() {
  console.log(document.readyState);
  if (document.readyState === "complete") {
    discordHack();
  }
}