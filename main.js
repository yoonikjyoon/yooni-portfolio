"use strict";

// Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  const target = event.target;
  const link = event.target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove("open");
  scrollIntoView(link);
  selectNavItem(target);
});
// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
});

// Handle click on "contact me" button on Home
const contactButton = document.querySelector(".home__contact");
contactButton.addEventListener("click", () => {
  scrollIntoView("#contact");
});

// Make home slowly fade to transparent as the window scrolls down.
const home = document.querySelector(".home__container");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  // 공식 사용 : (1 - window.scrollY / homeHeight) => 투명도에 넣기
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show 'arrow up' button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
document.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

// Projects
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
  // Remove selection from the previos item and select the new one
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");

  projectContainer.classList.add("anim-out");
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
    projectContainer.classList.remove("anim-out");
  }, 300);
});

// 1. 모든 섹션 요소들(id)과 메뉴 아이템들(id가 박힌 data-link요소)을 가져온다.
const sectionIds = [
  "#home",
  "#about",
  "#skills",
  "#work",
  "#testimonials",
  "#contact",
];
const sections = sectionIds.map((id) => document.querySelector(id));
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  selectedNavItem.classList.remove("active");
  //새로 active 시켜야하는 navbar item
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
}
function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    // entry.intersectionRatio > 0 - Home, Contact 요소선택되어야하므로
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      // 스크롤 방향 찾기
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // 요소의 y값이 - : 스크롤링이 아래로 되어 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        // 바로 뒤에 따라오는 index선택
        selectedNavIndex = index + 1;
        // 요소의 y값이 + : 스크롤링이 위로 되어 페이지가 내려감
      } else {
        //  바로 이전 index 선택
        selectedNavIndex = index - 1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.
//scroll은 윈도우 전체에서 실행되는것, wheel은 사용자가 스크롤링 하는것
window.addEventListener("wheel", () => {
  // Home
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
    // Contact
  } else if (
    window.scrollY + window.innerHeight ===
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  // Home, Contact 이외의 메뉴
  selectNavItem(navItems[selectedNavIndex]);
});
