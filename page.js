(async () => {
  const script = browser.runtime.getURL("./frame.js");
  const frame = await import(script);
  console.log("content script worked, (frame)", frame)
  browser.runtime.onMessage.addListener((msg) => {
    console.log("content script heard msg= ", msg)
    switch (msg.cmd) {
      case "create-ghost":
        console.log("trying to create ghost (page)", msg.page)



        // try {
          for (let i = 0; i < 20; i++) {
            setTimeout(() => {
              try {
                frame.open(msg.page).catch((err) => { console.log("error opening ghost", err) })
              } catch (e) {
                // console.log("error in nested try", e)
              }
            }, 50)

            break
          }
          console.log("i'm out of the for loop")
        // } catch (e) {
        //   console.log("error trying frame", e)
        // }
        // if (!(frame.open(msg.page).catch((err)=>{console.log("error opening ghost",err)}))){
        //   console.log("it worked, undefined")
        // } else {
        //   console.log("i'm in the else")
        // }


        break;
      default:
        console.log("Default case used for (msg) in page.js", msg);
    }
  });
})();