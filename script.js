function scrollToBooks() {
    document.getElementById("books").scrollIntoView({ behavior: "smooth" });
}

// COUPON
const COUPON = "INDO260410";

function applyCoupon() {
    let input = document.getElementById("coupon").value;

    if (input === COUPON) {
        localStorage.setItem("unlocked", "true");
        document.getElementById("couponMsg").innerText = "Unlocked 🔥";
        unlockAll();
    } else {
        document.getElementById("couponMsg").innerText = "Invalid ❌";
    }
}

// UNLOCK
function unlockAll() {
    localStorage.setItem("unlocked", "true");

    document.querySelectorAll(".buy").forEach(btn => {
        btn.innerText = "Read Now";
        btn.style.background = "green";
    });

    document.getElementById("library").style.display = "block";
}

// OPEN BOOK
function openBook(file) {
    if (localStorage.getItem("unlocked") === "true") {
        window.open(file, "_blank");
    } else {
        alert("Buy or unlock full set!");
    }
}

// FEEDBACK
let rating = 0;
function rate(n) {
    rating = n;
    document.querySelectorAll(".stars span").forEach((s, i) => {
        s.classList.toggle("active", i < n);
    });
}

function submitFeedback() {
    if (rating === 0) return alert("Rate first!");
    document.getElementById("msg").innerText = "Thanks ⭐ " + rating + "/5";
}

// LOAD
window.onload = () => {
    if (localStorage.getItem("unlocked") === "true") {
        unlockAll();
    }
};
