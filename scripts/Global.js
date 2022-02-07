const navLinkEl = Array.from($(".nav-link"));
let isMobile = window.matchMedia("(max-width: 768px)").matches;
// Navigation: Adds active class to current page
navLinkEl.forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
  link.addEventListener("click", (e) => {
    navLinkEl.forEach((link) => {
      link.classList.remove("active");
    });
    e.target.classList.add("active");

    // Scrolling to element with id (hash) of clicked link
    let hash = e.target.hash;
    if (hash === "") {
      hash = "#home";
    }
    setTimeout(() => {
      $("html, body").animate({ scrollTop: $(hash).offset()?.top }, 500, () => {
        window.location.hash = hash;
      });
    }, 100);
  });
});

let rellax = new Rellax(".rellax", {
  horizontal: true,

  //Disable vertical Parallax Scrolling     vertical:false
});

const saveLS = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLS = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const removeLsItem = (key) => {
  localStorage.removeItem(key);
};

var width = 8;
let barEl = $("#barStatus");
let progressBarEl = $("#progressBar");
progressBarEl.css("display", "none");
function progressBar(interval) {
  let id = 0;
  id = setInterval(frame, interval);
  function frame() {
    progressBarEl.css("display", "block");
    if (width >= 100) {
      clearInterval(id);
      barEl.css("width", 8 + "%");
      width = 8;
      progressBarEl.css("display", "none");
    } else {
      progressBarEl.css("display", "block");
      width++;
      barEl.css("width", width + "%");
    }
  }
}

let isSnackBarShown = false;

function showSnackBar(text) {
  if (!isSnackBarShown) {
    let snackBarEl = $("#snackbar");
    snackBarEl.attr("class", "show");
    snackBarEl.text(text);
    isSnackBarShown = true;
    setTimeout(() => {
      snackBarEl.attr("class", "");
      snackBarEl.text("");
      isSnackBarShown = false;
    }, 3000);
  }
}

$(document).ready(() => {
  setInterval(() => localStorage.removeItem("info-coins"), 2 * 60 * 1000);
  // After two minutes, delete the local storage coin item
});

const $subscribers = [];

document.addEventListener("route-update", () => {
  for (const sub of $subscribers) {
    sub.unsubscribe();
  }
});
