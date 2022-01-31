const navLinkEl = Array.from($(".nav-link"));
const coinsList = [];

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
    // use promise to wait for the element to be in the DOM
    setTimeout(() => {
      $("html, body").animate({ scrollTop: $(hash).offset().top }, 500, () => {
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
