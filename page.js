// listen for command from bg.js, when you hear it, send a command to fedwiki to creat ghost
// import * as frame from './frame.js'

(async () => {
    const src = chrome.runtime.getURL("./frame.js");
    const frame = await import(src);
    //contentMain.main();
    browser.runtime.onMessage.addListener((msg) => {
        console.log("received msg!")
        let page = { title: 'Salem Confluence', story: [{ type: 'map', text: '45,-123' }] }
        frame.open(page)
    });
})();

