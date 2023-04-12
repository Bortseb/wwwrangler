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

window.onload = (event) => {
    console.log("Window loaded. (event)", event)
}