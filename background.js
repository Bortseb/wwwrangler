/**
 * Returns all of the registered extension commands for this extension
 * and their shortcut (if active).
 *
 * Since there is only one registered command in this sample extension,
 * the returned `commandsArray` will look like the following:
 *    [{
 *       name: "toggle-feature",
 *       description: "Send a 'toggle-feature' event to the extension"
 *       shortcut: "Ctrl+Shift+U"
 *    }]
 */
let gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
  for (let command of commands) {
    // Note that this logs to the Add-on Debugger's console: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging
    // not the regular Web console.
    console.log(command);
  }
});

/**
 * Fired when a registered command is activated using a keyboard shortcut.
 *
 * In this sample extension, there is only one registered command: "Ctrl+Shift+Comma".
 * On Mac, this command will automatically be converted to "Command+Shift+U".
 */
browser.commands.onCommand.addListener((command) => {
  console.log(command)
  // instead of opening a new page, send command to page.js, to tell it to run wiki command to create ghost
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log(tabs[0])
    
    browser.tabs.sendMessage(tabs[0].id,{msg:"test msg"})
    // var currTab = tabs[0];
    // if (currTab) { // Sanity check
    //   /* do stuff */
    // }
  });
  // browser.tabs.create({url: "http://code.fed.wiki/view/frame-integration-promises"});


});
