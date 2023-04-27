document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "wrangle-page":
      browser.runtime.sendMessage({ cmd: "wrangle-page" });
      break;
    case "JSON-to-HSC":
      browser.runtime.sendMessage({ cmd: "JSON-to-HSC" });
      break;
    case "JSON-to-wiki":
      browser.runtime.sendMessage({ cmd: "JSON-to-wiki" });
      break;
    default:
      console.log("Default case used for click on popup", e.target.id);
  }
});