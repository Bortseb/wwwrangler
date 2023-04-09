browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case "ghost":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, { cmd: "ghost" })
      });
      // browser.tabs.create({url: "http://code.fed.wiki/view/frame-integration-promises"});
      break;
    default:
      console.log("Default case used for (command) in background.js", command);
  }
});
