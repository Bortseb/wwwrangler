import { get, set, update, clear } from "./idb-keyval@6.2.0-dist-index.js";

var tids = {}

async function awaitTids() {
  try {
    var getTids = await get("tids")
  } catch (err) {
    console.error(err)
    throw err
  }
  tids = getTids
}

awaitTids()

browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case "create-ghost":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, { cmd: "create-ghost" })
      });
      break;
    case "wrangle-page":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log("wrangle page (tabs)", tabs)
        let url = tabs[0].url
        let page = {
          title: tabs[0].title,
          url: url,
          story: [{
            type: 'paragraph',
            text: `[${url} ${url}]`
          }]
        }
        tids[url] = page
        browser.tabs.create({ url: url });
      });
      break;
    default:
      console.log("Default case used for (command) in background.js", command);
  }
});


// //Receiving commands from other scripts
// browser.runtime.onMessage.addListener((msg, sender) => {
//   switch (msg.cmd) {
//     case "queue-page":
//       tids[msg.url] = msg.page
//       set("tids", tids)
//         .then()
//         .catch((err) => console.log("Setting tids failed!", err));
//       break;
//     default:
//       console.log("Default case used for (msg) in background.js", msg);
//   }
// });

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  console.log("tabs.onUpdated (changeInfo, tabInfo)", changeInfo, tabInfo);
  if ("url" in changeInfo) {
    let url = changeInfo.url
    if (url in tids) {
      browser.tabs.sendMessage(tabId, { cmd: "create-ghost", page: tids[url]  })
    }
  }
});
