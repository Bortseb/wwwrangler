browser.runtime.onMessage.addListener((msg) => {
  switch (msg.cmd) {
    case "togglePopup":
      togglePopup();
      break
    default:
      console.log("Default case used for (msg) in content-script.js", msg);
  }
});

// Inject popup as hidden iframe to be toggled
var iframe = document.createElement('iframe');
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.borderWidth = "2px";
iframe.style.borderStyle = "solid";
iframe.src = browser.runtime.getURL("popup.html")

document.body.appendChild(iframe);

function togglePopup() {
  if (iframe.style.width == "0px") {
    iframe.style.width = "400px";
  }
  else {
    iframe.style.width = "0px";
  }
}