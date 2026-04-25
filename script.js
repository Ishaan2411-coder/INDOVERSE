function scrollToBooks() {
    document.getElementById("books").scrollIntoView({ behavior: "smooth" });
}

// COUPON
const COUPON = "INDO260410";

function applyCoupon() {
    let input = document.getElementById("coupon").value;

    if (input === COUPON) {
        unlockAll();
        document.getElementById("couponMsg").innerText = "Unlocked 🔥";
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
const lines = [
    { text: "SAHAY — A Normal Child → Cyber God", color: "#00ff88" },
    { text: "INDOVAR — Cyber God → Earth Protector", color: "#007bff" },
    { text: "PARADOX — Earth Protector → Genius of Time", color: "#ff8800" },
    { text: "FRACTURE — Genius of Time → Multiverse Killer", color: "#ff0033" },
    { text: "ASCENT — Multiverse Killer → Cristosapien", color: "#a020f0" }
];

let index = 0;
const text = document.getElementById("introText");
const intro = document.getElementById("intro");

function showLines() {
    if (index < lines.length) {
        text.style.opacity = "0";

        setTimeout(() => {
            text.innerText = lines[index].text;
            text.style.color = lines[index].color;
            text.style.opacity = "1";
            index++;
        }, 400);

        setTimeout(showLines, 2600);
    } else {
        setTimeout(() => {
            text.innerText = "ENTER THE INDOVERSE";
            text.style.color = "gold";
            text.style.fontSize = "2.5rem";
            text.style.opacity = "1";
        }, 500);

        setTimeout(() => {
            intro.style.opacity = "0";
            setTimeout(() => intro.style.display = "none", 1000);
        }, 3000);
    }
}

window.onload = () => {
    setTimeout(showLines, 800);
};
