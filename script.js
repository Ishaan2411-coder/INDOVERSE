function showTab(tabId) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
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
