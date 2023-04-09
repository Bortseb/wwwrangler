(async () => {
    const script = chrome.runtime.getURL("./frame.js");
    const frame = await import(script);
    browser.runtime.onMessage.addListener((msg) => {
        switch (msg.cmd) {
            case "get-page":
                browser.runtime.sendMessage({
                    cmd: "queue-page",
                    page: page,
                    title: document.title,
                    url: window.location.href
                });
                break;
            case "create-ghost":
                frame.open(msg.page)
                break;
            default:
                console.log("Default case used for (msg) in page.js", msg);
        }
    });
})();

