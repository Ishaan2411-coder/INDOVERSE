function scrollToBooks() {
    document.getElementById("books").scrollIntoView({ behavior: "smooth" });
}

// FEEDBACK
let rating = 0;

function rate(num) {
    rating = num;
    document.querySelectorAll(".stars span").forEach((s, i) => {
        s.classList.toggle("active", i < num);
    });
}

function submitFeedback() {
    let text = document.getElementById("fb").value;

    if (rating === 0) {
        alert("Select rating!");
        return;
    }

    if (text.trim() === "") {
        alert("Write feedback!");
        return;
    }

    document.getElementById("msg").innerText =
        "Thanks for your feedback! ⭐ " + rating + "/5";

    document.getElementById("fb").value = "";
    rating = 0;
    document.querySelectorAll(".stars span").forEach(s => s.classList.remove("active"));
}

// COUPON
const COUPON = "INDO260410";

function applyCoupon() {
    let input = document.getElementById("coupon").value;

    if (input === COUPON) {
        localStorage.setItem("unlocked", "true");
        document.getElementById("couponMsg").innerText = "Access Granted 🎉";
        unlockBooks();
    } else {
        document.getElementById("couponMsg").innerText = "Invalid Code ❌";
    }
}

function unlockBooks() {
    document.querySelectorAll(".buy").forEach(btn => {
        btn.innerText = "Read Now";
        btn.style.background = "green";
    });
}

// OPEN BOOK
function openBook(file) {
    if (localStorage.getItem("unlocked") === "true") {
        window.open(file, "_blank");
    } else {
        alert("Please buy or apply coupon first!");
    }
}

window.onload = () => {
    if (localStorage.getItem("unlocked") === "true") {
        unlockBooks();
    }
};
