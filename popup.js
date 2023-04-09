document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "create-ghost":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, { cmd: "create-ghost" })
      });
      // browser.tabs.create({url: "http://code.fed.wiki/view/frame-integration-promises"});
      break;
    case "wrangle-page":
      browser.tabs.create({url: "http://robert.wiki.openlearning.cc"});
      break;
    default:
      console.log("Default case used for click on popup", e.target.id);
  }
});
