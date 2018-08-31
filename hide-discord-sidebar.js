function discordHack() {
  if (document.querySelector('.divider-2PMBlV').parentNode.childNodes.length == 7 || document.querySelector('.divider-2PMBlV').parentNode.childNodes.length == 4) {

    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Hide/Show");
    btn.appendChild(t);
    btn.classList.add("hideNshow");

    btn.onclick = function () {
      if (
        document.getElementsByClassName('guildsWrapper-5TJh6A')[0].style.display === 'none') {
        document.getElementsByClassName('guildsWrapper-5TJh6A')[0].style.display = 'flex';
        document.getElementsByClassName('channels-Ie2l6A')[0].style.width = '35vmin';
      } else {
        document.getElementsByClassName('guildsWrapper-5TJh6A')[0].style.display = 'none';
        document.getElementsByClassName('channels-Ie2l6A')[0].style.width = '25vmin';
      }
    }
    document.body.appendChild(btn)
    console.log("Discord Sidebar Hack Complete!");
  }
}

window.onresize = function () {
  if (window.innerWidth < 700) {
    document.getElementsByClassName('guildsWrapper-5TJh6A')[0].style.display = 'none';
    document.getElementsByClassName('channels-Ie2l6A')[0].style.width = '25vmin';
  } else {
    document.getElementsByClassName('guildsWrapper-5TJh6A')[0].style.display = 'flex';
    document.getElementsByClassName('channels-Ie2l6A')[0].style.width = '35vmin';
  }
}


setTimeout(discordHack, 2000);