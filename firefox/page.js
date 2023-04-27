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
      case "JSON-to-HSC":
        console.log("in the HSC module (document)", document)
        await asyncTimeout(3000)

        var actualCode =
          `
            console.log("this is in the page!")
            let json = {
              "nodes": [
                {
                  "type": "Magic",
                  "in": [],
                  "out": [],
                  "props": {
                    "name": "${msg.title}"
                  }
                }
              ],
              "rels": []
            };
            console.log("json",json)
            window.dispatchEvent(new CustomEvent('target', {detail:json}));
          `;

        var script = document.createElement('script');
        script.textContent = actualCode;
        (document.head || document.documentElement).appendChild(script);
        script.remove();
        1
        break;
      case "JSON-to-wiki":

        break;
      default:
        console.log("Default case used for (msg) in page.js", msg);
    }
  });
})();