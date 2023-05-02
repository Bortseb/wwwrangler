document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "wrangle-page":
      browser.runtime.sendMessage({ cmd: "wrangle-page" })
      window.close()
      break
    case "JSON-to-HSC":
      browser.runtime.sendMessage({ cmd: "JSON-to-HSC" })
      window.close()
      break
    default:
      console.log("Default case used for click on popup", e.target.id)
  }
});