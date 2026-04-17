let selectedRating = 0;

function rate(star) {
    selectedRating = star;
    let stars = document.querySelectorAll(".stars span");

    stars.forEach((s, index) => {
        if (index < star) {
            s.classList.add("active");
        } else {
            s.classList.remove("active");
        }
    });
}

function submitFeedback() {
    let text = document.getElementById("feedbackText").value;

    if (selectedRating === 0) {
        alert("Please select rating!");
        return;
    }

    document.getElementById("thankYouMsg").innerText =
        "Thanks for your feedback! ⭐ " + selectedRating + "/5";

    document.getElementById("feedbackText").value = "";

    let stars = document.querySelectorAll(".stars span");
    stars.forEach(s => s.classList.remove("active"));
}function scrollToBooks() {
    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
}
