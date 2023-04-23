document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "create-ghost":
      browser.runtime.sendMessage({ cmd: "create-ghost" });
      break;
    case "wrangle-page":
      browser.runtime.sendMessage({ cmd: "wrangle-page" });
      break;
    case "clear-data":
      browser.runtime.sendMessage({ cmd: "clear-data" });
      break;
    default:
      console.log("Default case used for click on popup", e.target.id);
  }
});
