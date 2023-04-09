(async () => {
    const script = chrome.runtime.getURL("./frame.js");
    const frame = await import(script);
    browser.runtime.onMessage.addListener((msg) => {
        switch (msg.cmd) {
            case "create-ghost":
                let page = {
                    title: document.title,
                    story: [{
                        type: 'paragraph',
                        text: `[${window.location.href} ${window.location.href}]`
                    }]
                }
                frame.open(page)
                break;
            default:
                console.log("Default case used for (msg) in page.js", msg);
        }
    });
})();

