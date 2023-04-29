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

        await asyncTimeout(3000)

        var code =
          `
            let json = {
              "nodes": [
                {
                  "type": "Hyperlink",
                  "in": [],
                  "out": [],
                  "props": {
                    "name": "${msg.title}",
                    "url": "${msg.url}"
                  }
                }
              ],
              "rels": []
            };

            window.dispatchEvent(new CustomEvent('target', {detail:json}));
          `;

        var script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();

        break;
      case "JSON-to-wiki":

        await asyncTimeout(3000)

        var code =
          `
        let data = {
          "title": "Example JSON Template",
          "story": [
            {
              "type": "paragraph",
              "id": "56df43f2ab7cd3d2",
              "text": "Paragraph item"
            }
          ],
          "journal": [
            {
              "type": "create",
              "item": {
                "title": "Example JSON Template",
                "story": []
              },
              "date": 1682737831177
            },
            {
              "type": "fork",
              "date": 1682737836261
            },
            {
              "item": {
                "type": "factory",
                "id": "56df43f2ab7cd3d2"
              },
              "id": "56df43f2ab7cd3d2",
              "type": "add",
              "date": 1682737837756
            },
            {
              "type": "edit",
              "id": "56df43f2ab7cd3d2",
              "item": {
                "type": "paragraph",
                "id": "56df43f2ab7cd3d2",
                "text": "Paragraph item"
              },
              "date": 1682737845844
            }
          ]
        };

        let dropEvent = new CustomEvent('drop')
        dropEvent.dataTransfer.setData('application/ld+json', JSON.stringify(data));
        window.dispatchEvent(dropEvent);
        `;

        var script = document.createElement('script');
        script.textContent = code;
        (document.head || document.documentElement).appendChild(script);
        script.remove();


        break;
      default:
        console.log("Default case used for (msg) in page.js", msg);
    }
  });
})();