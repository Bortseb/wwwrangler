(async () => {
  const script = browser.runtime.getURL("./frame.js");
  const frame = await import(script);

  browser.runtime.onMessage.addListener((msg) => {
    switch (msg.cmd) {
      case "create-ghost":
        console.log("trying to create ghost (page)", msg.page)

        let context = frame.context()
        console.log("frame context = ", context)
        //change this to try a few times to speak to the frame plugin and create ghost, if fails, then send alert
        setTimeout(() => {
          frame.open(msg.page)
        }, 3000)

        break;
      default:
        console.log("Default case used for (msg) in page.js", msg);
    }
  });

})();
