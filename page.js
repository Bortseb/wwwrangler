async function asyncTimeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async () => {
  const script = browser.runtime.getURL("./frame.js");
  const frame = await import(script);
  console.log("content script worked, (frame)", frame)
  browser.runtime.onMessage.addListener(async (msg) => {
    console.log("content script heard msg= ", msg)
    switch (msg.cmd) {
      case "create-ghost":
        console.log("trying to create ghost (page)", msg.page)


        let success = false
        // try {
        for (let i = 0; i < 10; i++) {
          try {
            console.log("starting loop i=", i)
            let time = Date.now()
            console.log("Time before timeout", time)
            await asyncTimeout(10)
            console.log("Time after timeout", time, Date.now() - time)

            let context = await frame.context()
            console.log("context =", context)
            success = true
            console.log("before open frame")
            await frame.open(msg.page)
            console.log("after open frame")
            context = await frame.context()
            console.log("context after frame=", context)
            const windowLocation = "" + window.location;
            console.log("window location", windowLocation)
            console.log("ending loop i=", i)
          } catch (e) {
            console.log("got an error getting context ", e)
          }
          if (success) break
          // frame.context().then(()=>{
          //   success = true
          //   console.log("success=", success)
          // })
          // if (success) break;
          // try {
          //   success = true
          // } catch (e) {
          //   console.log("error in nested try", e)
          // }
          // setTimeout(() => {
          //   console.log("waiting 50 ms")
          // }, 50)



          // try {
          //   (async () => {
          //     await asyncTimeout(1000)
          //     let ghost = await frame.open(msg.page)
          //     let context = await frame.context()
          //     console.log("ghost =", ghost)
          //     console.log("context =", context)
          //   })();

          // } catch (e) {
          //   console.log("error trying frame open", e)
          // }
          // console.log("success=", success)
          // if (success) break
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