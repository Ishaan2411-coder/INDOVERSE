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
            }, 800); // Wait for the transition to finish before removing from DOM
        }, 2500); // Display intro for 2.5 seconds
    }
});

// ======================== //
//   SMOOTH SCROLL          //
// ======================== //
function scrollToBooks(){
    document.getElementById("books").scrollIntoView({
        behavior:"smooth"
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
