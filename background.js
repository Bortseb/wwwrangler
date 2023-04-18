import { get, set, update, clear } from "./idb-keyval@6.2.0-dist-index.js";

var tids = await get("tids")
if (tids === undefined) { tids = {} }
console.log("tids= ", tids)

browser.commands.onCommand.addListener((command) => {
  switch (command) {
    case "create-ghost":
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { cmd: "create-ghost" })
      });
      break;
    case "wrangle-page":
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        let url = tabs[0].url
        let page = {
          title: tabs[0].title,
          story: [{
            type: 'paragraph',
            text: `[${url} ${url}]`
          }]
        }
        tids['http://robert.wiki.openlearning.cc/view/welcome-visitors'] = page
        console.log("tids after adding page", tids)
        set("tids", tids).catch((err) => console.log("Setting tids failed!", err));
        get('tids').then((val) => console.log("Get tids=", val));
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
      set("tids", {}).catch((err) => console.log("Clearing tids data failed!", err));

      console.log("tids cleared?", tids)
      break;

    default:
      console.log("Default case used for (msg) in background.js", msg);
  }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if ("status" in changeInfo && changeInfo.status === "complete") {
    let url = tabInfo.url

    console.log("status complete! (url, tids)", url, tids)
    if (url in tids) {
      console.log("URL in tids!")
      browser.tabs.sendMessage(tabId, { cmd: "create-ghost", page: tids[url] })
      console.log("sent page =", tids[url])
      delete tids[url]
      set("tids", tids).catch((err) => console.log("Clearing tids data failed!", err));
      console.log("tids after creating ghost, and delete", tids)
    }
  }
});
