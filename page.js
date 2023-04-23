(async () => {
  const script = browser.runtime.getURL("./frame.js");
  const frame = await import(script);
  console.log("content script worked, (frame)", frame)
  browser.runtime.onMessage.addListener((msg) => {
    console.log("content script heard msg= ",msg)
      switch (msg.cmd) {
          case "create-ghost":
              console.log("trying to create ghost (page)", msg.page)
              setTimeout(() => {
                  frame.open(msg.page)
              }, 3000)

              break;
          default:
              console.log("Default case used for (msg) in page.js", msg);
      }
  });
})();