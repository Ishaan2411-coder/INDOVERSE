// ======================== //
//   DARK MODE TOGGLE       //
// ======================== //
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("indoverse-theme");
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("indoverse-theme", isDark ? "dark" : "light");
    });
}

// ======================== //
//   VERSION TOGGLE PICKER  //
// ======================== //
function openBook(event, filename) {
    window.open(filename, "_blank");
    const btn = event.currentTarget;
    const siblings = btn.parentElement.querySelectorAll(".ver-btn");
    siblings.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// ======================== //
//   COOL INTRO OVERLAY     //
// ======================== //
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add("fade-out");
            setTimeout(() => overlay.remove(), 800);
        }, 2500);
    }
});

// ======================== //
//   SMOOTH SCROLL          //
// ======================== //
function scrollToBooks() {
    const el = document.getElementById("books");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ======================== //
//   ACCORDIONS TOGGLE      //
// ======================== //
const accordions = document.querySelectorAll(".accordion-btn");
accordions.forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        content.classList.toggle("active");
        button.classList.toggle("active");
    });
});

// ======================== //
