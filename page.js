async function asyncTimeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const script = browser.runtime.getURL("./frame.js");
  const frame = await import(script);
  console.log("content script worked, (frame)", frame)
  browser.runtime.onMessage.addListener(async (msg) => {
    console.log("content script heard msg= ", msg)
    switch (msg.cmd) {
      case "create-ghost":
        console.log("trying to create ghost (page)", msg.page)
        let success = false

        for (let i = 0; i < 30; i++) {
          try {
            await asyncTimeout(100)
            await frame.open(msg.page)
            const windowLocation = "" + window.location;
            if (windowLocation !== msg.url) success = true
          } catch (e) {
            console.log("got an error getting context ", e)
          }
          if (success) break
        }
        if (!success) alert("Failed to wrangle page")
        break;
      default:
        console.log("Default case used for (msg) in page.js", msg);
    }
  });
})();