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
    if (rating === 0 || text.trim() === "") {
        alert("Complete feedback!");
        return;
    }
    document.getElementById("msg").innerText = "Thanks! ⭐ " + rating + "/5";
}

// COUPON
const COUPON = "INDO260410";

function applyCoupon() {
    let input = document.getElementById("coupon").value;

    if (input === COUPON) {
        localStorage.setItem("unlocked", "true");

        document.getElementById("couponMsg").innerText = "Full Access Unlocked 🔥";

        unlockAll();
    } else {
        document.getElementById("couponMsg").innerText = "Invalid Code ❌";
    }
}

function unlockAll() {
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
        alert("Unlock access first!");
    }
}

// LOAD STATE
window.onload = () => {
    if (localStorage.getItem("unlocked") === "true") {
        unlockAll();
    }
};
