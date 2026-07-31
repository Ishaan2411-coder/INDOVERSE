// ======================== //
//   DARK MODE TOGGLE       //
// ======================== //
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved preference from localStorage
const savedTheme = localStorage.getItem("indoverse-theme");
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("indoverse-theme", isDark ? "dark" : "light");
});

// ======================== //
//   VERSION TOGGLE PICKER  //
// ======================== //
function openBook(event, filename) {
    // Open the PDF
    window.open(filename, '_blank');

    // Highlight the clicked button as active within its toggle group
    const btn = event.currentTarget;
    const siblings = btn.parentElement.querySelectorAll('.ver-btn');
    siblings.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ======================== //
//   COOL INTRO OVERLAY     //
// ======================== //
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add("fade-out");
            setTimeout(() => {
                overlay.remove();
            }, 800);
        }, 2500);
    }
});

// ======================== //
//   SMOOTH SCROLL          //
// ======================== //
function scrollToBooks(){
    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
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
