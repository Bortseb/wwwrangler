import { get } from "./idb-keyval@6.2.0-dist-index.js"

var sites = await get("sites")
if (sites === undefined) sites = []

var defaultSite = await get("defaultSite")
if (defaultSite === undefined) defaultSite = ""

var datalist = document.getElementById("sites");

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

document.addEventListener("click", (e) => {
  switch (e.target.id) {
    case "wrangle-page":
      var inputBox = document.getElementById("sitesInput");
      try {
        if (inputBox.value === "") {
          var url = new URL(defaultSite)
        } else {
          var url = new URL(inputBox.value)
        }
        if (url !== undefined) {
          console.log("Url before wrangle is", url.href)
          browser.runtime.sendMessage({ cmd: "wrangle-page", url: url.href })
        }
      } catch (err) {
        throw err;
      }
      break
    case "JSON-to-HSC":
      browser.runtime.sendMessage({ cmd: "JSON-to-HSC" })
      break
    case "addSite":
      addSite()
      break
    case "removeSite":
      var inputBox = document.getElementById("sitesInput");
      try {
        var url = new URL(inputBox.value)
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
      var inputBox = document.getElementById("sitesInput");
      var url = new URL(inputBox.value)

      if (defaultSite !== url.href) {
        defaultSite = url.href
        set("defaultSite", defaultSite).catch((err) => console.log("Setting defaultSite failed!", err));
        addSite()
      }
      break
    case "clearSites":
      var inputBox = document.getElementById("sitesInput");
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