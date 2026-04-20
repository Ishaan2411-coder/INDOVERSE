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
    if (rating === 0) {
        alert("Select rating!");
        return;
    }

    document.getElementById("msg").innerText =
        "Thanks for your feedback! ⭐ " + rating + "/5";

    document.getElementById("fb").value = "";
}
