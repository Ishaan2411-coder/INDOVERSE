function scrollToBooks() {
    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
}

const COUPON = "INDO260410";

function applyCoupon() {
    let input = document.getElementById("coupon").value;

    if (input === COUPON) {
        localStorage.setItem("unlocked", "true");

        document.getElementById("couponMsg").innerText =
            "Access Granted 🎉";

        unlockBooks();
    } else {
        document.getElementById("couponMsg").innerText =
            "Invalid Code ❌";
    }
}

function unlockBooks() {
    let buttons = document.querySelectorAll(".buy");

    buttons.forEach(btn => {
        btn.innerText = "Read Now";
        btn.style.background = "green";
    });
}

// Load state
window.onload = function () {
    if (localStorage.getItem("unlocked") === "true") {
        unlockBooks();
    }
};
