function scrollToBooks() {
    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
}

let rating = 0;

function rate(num) {
    rating = num;
    let stars = document.querySelectorAll(".stars span");

    stars.forEach((s, i) => {
        if (i < num) {
            s.classList.add("active");
        } else {
            s.classList.remove("active");
        }
    });
}

function submitFeedback() {
    let text = document.getElementById("fb").value;

    if (rating === 0) {
        alert("Please select rating!");
        return;
    }

    if (text.trim() === "") {
        alert("Please write feedback!");
        return;
    }

    document.getElementById("msg").innerText =
        "Thanks for your feedback! ⭐ " + rating + "/5";

    document.getElementById("fb").value = "";
    rating = 0;

    let stars = document.querySelectorAll(".stars span");
    stars.forEach(s => s.classList.remove("active"));
}
