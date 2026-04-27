function scrollToBooks() {
    document.getElementById("books").scrollIntoView({ behavior: "smooth" });
}

function openBook(file) {
    window.open(file, "_blank");
}

/* INTRO */
const lines = [
    { text: "A Normal Child → Cyber God", color: "#00ff88" },
    { text: "Cyber God → Earth Protector", color: "#007bff" },
    { text: "Earth Protector → Genius of Time", color: "#ff8800" },
    { text: "Genius of Time → Multiverse Killer", color: "#ff0033" },
    { text: "Multiverse Killer → Cristosapien", color: "#a020f0" }
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

        setTimeout(showLines, 2500);
    } else {
        setTimeout(() => {
            intro.style.display = "none";
        }, 1500);
    }
}

window.onload = () => {
    setTimeout(showLines, 800);
};
