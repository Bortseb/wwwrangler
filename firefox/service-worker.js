import "./browser-polyfill.min.js";
import { get, set } from "./idb-keyval@6.2.0-dist-index.js";

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

    let site = "http://robert.wiki.openlearning.cc/view/welcome-visitors/view/about-frame-plugin"
    browser.tabs.create({ url: site })
      .then((tab) => {
        browser.tabs.executeScript(tab.id, {
          file: "./browser-polyfill.min.js",
          allFrames: true,
        })
          .then(() => {
            browser.tabs.executeScript(tab.id, {
              file: "./content-script.js",
              allFrames: true,
            })
              .then(() => {
                browser.tabs.sendMessage(tab.id, {
                  cmd: "create-ghost", page: page, url: site
                })
                  .catch((err) =>
                    console.log("error from sendMessage", err))
              }, (err) => {
                console.log("Error injecting content-script.js", err)
              })
          }, (err) => {
            console.log("error injecting polyfill", err)
          }
          );
      });
  });
}

function jsonToHSC() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    console.log('tabs', tabs)
    let title = tabs[0].title
    let url = tabs[0].url

    let site = "http://hsc.fed.wiki/assets/home/index.html"
    browser.tabs.create({ url: site }).then((tab) => {
      browser.tabs.executeScript(tab.id, {
        file: "./browser-polyfill.min.js",
        allFrames: true,
      }).then(() => {
        browser.tabs.executeScript(tab.id, {
          file: "./content-script.js",
          allFrames: true,
        }).then(() => {
          browser.tabs.sendMessage(tab.id, {
            cmd: "JSON-to-HSC", title: title, url: url
          }).catch((err) =>
            console.log("error from sendMessage", err))
        }, (err) => {
          console.log("Error injecting content-script.js", err)
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
    case "JSON-to-HSC":
      jsonToHSC()
      break;
    default:
      console.log("Default case used for (msg) in background.js", msg);
  }
});