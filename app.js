// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);

// ===== Year =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Burger Menu =====
const burgerBtn = $("#burgerBtn");
const nav = $("#nav");

if (burgerBtn && nav) {
  burgerBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    burgerBtn.setAttribute("aria-expanded", String(isOpen));
    burgerBtn.textContent = isOpen ? "×" : "☰";
  });

  nav.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-link") && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      burgerBtn.setAttribute("aria-expanded", "false");
      burgerBtn.textContent = "☰";
    }
  });
}

// ===== Scroll to top =====
const scrollBtn = $("#scrollTopBtn");
window.addEventListener("scroll", () => {
  if (!scrollBtn) return;
  scrollBtn.style.display = window.scrollY > 350 ? "inline-flex" : "none";
});
if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Cookies banner (localStorage) =====
const cookies = $("#cookies");
const acceptCookiesBtn = $("#acceptCookies");
const COOKIE_KEY = "cookiesAccepted";

function updateCookiesUI() {
  if (!cookies) return;
  const accepted = localStorage.getItem(COOKIE_KEY) === "true";
  cookies.style.display = accepted ? "none" : "flex";
}

if (acceptCookiesBtn) {
  acceptCookiesBtn.addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "true");
    updateCookiesUI();
  });
}
updateCookiesUI();

// ===== Feed page: fetch + render + sort =====
async function initFeed() {
  const list = $("#postsList");
  const sortSelect = $("#sortSelect");
  if (!list) return;

  try {
    const res = await fetch("./data/posts.json");
    const posts = await res.json();

    function render(items) {
      list.innerHTML = items.map(p => `
        <article class="card card-post">
          <img src="${p.image}" alt="${p.title}">
          <div class="card-body">
            <span class="pill">${p.category}</span>
            <h3>${p.title}</h3>
            <p>${p.location} • ${p.date}</p>
            <p>${p.excerpt}</p>
          </div>
        </article>
      `).join("");
    }

    function sortPosts(items, mode) {
      const copy = [...items];
      if (mode === "date_desc") copy.sort((a,b) => new Date(b.date) - new Date(a.date));
      if (mode === "date_asc") copy.sort((a,b) => new Date(a.date) - new Date(b.date));
      if (mode === "title_asc") copy.sort((a,b) => a.title.localeCompare(b.title));
      return copy;
    }

    render(sortPosts(posts, "date_desc"));

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        render(sortPosts(posts, e.target.value));
      });
    }

  } catch (err) {
    list.innerHTML = `<p style="color:#b9c3ff;">Could not load posts.json</p>`;
  }
}
initFeed();
