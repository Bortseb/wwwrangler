async function asyncTimeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const script = browser.runtime.getURL("./frame.js");
  const frame = await import(script);

  browser.runtime.onMessage.addListener(async (msg) => {
    switch (msg.cmd) {
      case "create-ghost":
        let windowLocation = "" + window.location;

        for (let i = 0; i < 50; i++) {
          await asyncTimeout(100)
          windowLocation = "" + window.location;
          if (windowLocation === msg.url) frame.open(msg.page)
          else break
        }
        break;
      default:
        console.log("Default case used for (msg) in page.js", msg);
    }
  });
})();