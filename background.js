import { get, set, update, clear } from "./idb-keyval@6.2.0-dist-index.js";

var tids = {}

async function awaitTids() {
  try {
    var getTids = await get("tids")
    console.log("getTids= ", getTids)
    tids = getTids
    console.log("set tids= ", tids)
    //return getTids
  } catch (err) {
    console.error(err)
    throw err
  }
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
          story: [{
            type: 'paragraph',
            text: `[${url} ${url}]`
          }]
        }
        console.log("tids before wait in commands", tids)
        awaitTids()
        console.log("tids after wait in commands", tids)
        tids['http://robert.wiki.openlearning.cc/view/welcome-visitors'] = page
        console.log("tids after adding page", tids)
        set("tids", tids)
          .then()
          .catch((err) => console.log("Setting tids failed!", err));
        awaitTids()
        console.log("tids after setting", tids)
        browser.tabs.create({ url: 'http://robert.wiki.openlearning.cc/view/welcome-visitors' });
      });
      break;
    default:
      console.log("Default case used for (command) in background.js", command);
  }
});


//Receiving commands from other scripts
browser.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.cmd) {
    case "clear-data":
      tids = {}
      set("tids", {})
        .then()
        .catch((err) => console.log("Clearing tids data failed!", err));
      awaitTids()
      console.log("tids cleared?", tids)
      break;
    // case "queue-page":
    //   tids[msg.url] = msg.page
    //   set("tids", tids)
    //     .then()
    //     .catch((err) => console.log("Setting tids failed!", err));
    //   break;
    default:
      console.log("Default case used for (msg) in background.js", msg);
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  console.log("tabs.onUpdated (changeInfo, tabInfo)", changeInfo, tabInfo);
  if ("status" in changeInfo && changeInfo.status === "complete") {
    let url = tabInfo.url
    awaitTids()
    console.log("status complete! (url, tids)", url, tids)
    if (url in tids) {
      console.log("URL in tids!")
      browser.tabs.sendMessage(tabId, { cmd: "create-ghost", page: tids[url] })
      console.log("sent page =", tids[url])
    }
  }
});
