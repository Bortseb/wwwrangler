document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "wrangle-page":
      browser.runtime.sendMessage({ cmd: "wrangle-page" });
      break;
    default:
      console.log("Default case used for click on popup", e.target.id);
  }
});