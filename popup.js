document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "create-ghost":
      browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = 'http://robert.wiki.openlearning.cc/view/welcome-visitors'
        let page = {
          title: "test",
          story: [{
            type: 'paragraph',
            text: `[${url} ${url}]`
          }]
        }
        browser.tabs.sendMessage(tabs[0].id, { cmd: "create-ghost", page: page })
      });
      // browser.tabs.create({url: "http://code.fed.wiki/view/frame-integration-promises"});
      break;
    case "wrangle-page":
      browser.tabs.create({ url: "http://robert.wiki.openlearning.cc/welcome-visitors.html" });
      break;
    case "clear-data":
      browser.runtime.sendMessage({ cmd: "clear-data" });
      break;
    default:
      console.log("Default case used for click on popup", e.target.id);
  }
});
