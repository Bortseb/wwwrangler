import "./browser-polyfill.min.js";
// import { get, set } from "./idb-keyval@6.2.0-dist-index.js";

function wranglePage() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let url = tabs[0].url
    let page = {
      title: tabs[0].title,
      story: [{
        type: 'paragraph',
        text: `[${url} ${url}]`
      }]
    }

    browser.tabs.create({ url: 'http://robert.wiki.openlearning.cc/view/welcome-visitors' }).then((tab) => {
      browser.tabs.executeScript(tab.id, {
        file: "./browser-polyfill.min.js",
        allFrames: true,
      }).then(() => {
        browser.tabs.executeScript(tab.id, {
          file: "./page.js",
          allFrames: true,
        }).then(() => {
          browser.tabs.sendMessage(tab.id, { cmd: "create-ghost", page: page })
        }, (err) => {
          console.log("Error injecting page.js", err)
        })
      }, (err) => {
        console.log("error injecting polyfill:", err)
      }
      );
    });
  });
}

browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case "wrangle-page":
      wranglePage()
      break;
    default:
      console.log("Default case used for (command) in background.js", command);
  }
});


//Receiving commands from other scripts
browser.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.cmd) {
    case "wrangle-page":
      wranglePage()
      break;
    default:
      console.log("Default case used for (msg) in background.js", msg);
  }
});
