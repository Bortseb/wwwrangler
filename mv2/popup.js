import { get } from "./idb-keyval@6.2.0-dist-index.js"

var sites = await get("sites")
if (sites === undefined) sites = []

var defaultSite = await get("defaultSite")
if (defaultSite === undefined) defaultSite = ""

var datalist = document.getElementById("sites");
var sitesInput = document.getElementById("sitesInput");

function loadSiteList() {
  for (const site of sites) {
    var option = document.createElement('option');
    option.value = site
    datalist.appendChild(option)
  }
}
loadSiteList()

function addSite() {
  var inputBox = document.getElementById("sitesInput");
  try {
    var url = new URL(inputBox.value)
    var index = sites.indexOf(url.href)
    if (index === -1) {
      sites.push(url.href)
      set("sites", sites).catch((err) => console.log("Setting sites failed! (AddSite)", err));
      datalist.textContent = ""
      loadSiteList()
      inputBox.value = ""
    } else {
      //site already in list
    }
  } catch (err) {
    console.error(err)
    throw err;
  }
}

function getTargetSite() {
  if (sitesInput.value === "") {
    if (defaultSite === "") {
      alert("You don't have a default site set");
      return false;
    }
    var url = new URL(defaultSite)
  } else {
    if (!sitesInput.checkValidity()) {
      alert("The site you are trying to wrangle to is not a valid URL");
      return false
    }
    var url = new URL(sitesInput.value)
  }
  return url
}

document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "wrangle-page":
      var url = getTargetSite()
      console.log("Url before wrangle is", url.href)
      if (url) browser.runtime.sendMessage({ cmd: "wrangle-page", url: url.href })
      break
    case "JSON-to-HSC":
      browser.runtime.sendMessage({ cmd: "JSON-to-HSC" })
      break
    case "addSite":
      browser.runtime.sendMessage({ cmd: "addSite", url: url.href })
      break
    case "removeSite":
      try {
        var url = new URL(sitesInput.value)
        var index = sites.indexOf(url.href)
        if (index > -1) {
          sites.splice(index, 1)
        }
        set("sites", sites).catch((err) => console.log("Setting sites failed! (removedSite)", err));
        datalist.textContent = ""
        loadSiteList()
      } catch (err) {
        console.error(err)
        throw err;
      }
      break
    case "defaultSite":
      var url = new URL(sitesInput.value)

      if (defaultSite !== url.href) {
        defaultSite = url.href
        set("defaultSite", defaultSite).catch((err) => console.log("Setting defaultSite failed!", err));
        addSite()
      }
      break
    case "clearSites":
      sites = []
      set("sites", sites).catch((err) => console.log("Setting sites failed! (clearSites)", err));
      defaultSite = ""
      set("defaultSite", defaultSite).catch((err) => console.log("Setting defaultSite failed!", err));
      datalist.textContent = ""
      break
    default:
    //console.log("Default case used for click on popup", e.target.id)
  }
});
