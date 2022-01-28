const capitallize = (str) => str[0].toUpperCase() + str.slice(1);

async function fetchHtmlAsText(url) {
  return await $.ajax(url);
}

async function loadPage(page, oldPage) {
  // Setting our template to html
  const contentDiv = document.getElementById("app");
  contentDiv.innerHTML = await fetchHtmlAsText(`../pages/${page}/${page}.html`);

  // Removing old script
  if (document.getElementById("script_" + oldPage)) {
    contentDiv.removeChild("#script_" + oldPage);
  }

  // Injecting new script
  const script = document.createElement("script");
  script.src = `../pages/${page}/${page}.js`;
  script.type = "text/javascript";
  script.id = "script_" + page;
  contentDiv.appendChild(script);

  document.dispatchEvent(new CustomEvent("route-update", { detail: { to: page, from: oldPage } }));
}

const Router = {
  getHash(hash) {
    if (!hash) {
      return capitallize("home");
    }

    const hashPath = hash.split("?")[0].replace("#", "").toLowerCase();

    return capitallize(hashPath);
  },
  getCurrentQuery() {
    if (location.hash) {
      const query = location.hash.split("?")[1];
      return Object.fromEntries(new URLSearchParams(query));
    } else {
      return null;
    }
  },
};

loadPage(Router.getHash(location.hash));

window.addEventListener(
  "hashchange",
  (ev) => {
    const newPath = Router.getHash(ev.target.location.hash);
    const oldPath = ev.oldURL.split("#")[1];
    // Load current entered page
    loadPage(newPath || "Home", oldPath || "Home");
  },
  false
);
