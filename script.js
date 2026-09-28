// ======================== //
//   DARK MODE TOGGLE       //
// ======================== //
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("indoverse-theme");
if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("indoverse-theme", isDark ? "dark" : "light");
    });
}

// ======================== //
//   VERSION TOGGLE PICKER  //
// ======================== //
function openBook(event, filename) {
    window.open(filename, "_blank");
    const btn = event.currentTarget;
    const siblings = btn.parentElement.querySelectorAll(".ver-btn");
    siblings.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// ======================== //
//   COOL INTRO OVERLAY     //
// ======================== //
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("intro-overlay");
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add("fade-out");
            setTimeout(() => overlay.remove(), 800);
        }, 2500);
    }
});

// ======================== //
//   SMOOTH SCROLL          //
// ======================== //
function scrollToBooks() {
    const el = document.getElementById("books");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ======================== //
//   ACCORDIONS TOGGLE      //
// ======================== //
const accordions = document.querySelectorAll(".accordion-btn");
accordions.forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        content.classList.toggle("active");
        button.classList.toggle("active");
    });
});

// ======================== //
//   EXACT-LINE AUDIOBOOK   //
//   VOICE READER ENGINE    //
// ======================== //

// Player State
const playerState = {
    synth: window.speechSynthesis || null,
    currentBook: null,
    chunks: [], // Array of { text, page, chapter }
    chunkIndex: 0,
    isPaused: false,
    isPlaying: false,
    speed: 1.0,
    speedOptions: [1.0, 1.25, 1.5, 2.0],
    speedIndex: 0,
    selectedVoice: null
};

// Auto-select preferred voice (Indian English, Hindi, or natural English)
function initVoices() {
    if (!playerState.synth) return;
    const voices = playerState.synth.getVoices();
    if (!voices || voices.length === 0) return;

    // Prefer Indian English / Hindi accent voices for natural Hinglish narration
    const preferred = voices.find(v => 
        v.lang.toLowerCase().includes("in") || 
        v.name.toLowerCase().includes("india") ||
        v.name.toLowerCase().includes("hindi")
    ) || voices.find(v => v.lang.toLowerCase().startsWith("en")) || voices[0];

    playerState.selectedVoice = preferred;
}

if (playerState.synth) {
    if (playerState.synth.onvoiceschanged !== undefined) {
        playerState.synth.onvoiceschanged = initVoices;
    }
    initVoices();
}

// Convert exact page text into speech-friendly sentence chunks
function buildExactSpeechChunks(pages) {
    const chunks = [];
    if (!pages || pages.length === 0) return chunks;

    for (const pageObj of pages) {
        const pageNum = pageObj.page || 1;
        const chapter = pageObj.chapter || "";
        const raw = pageObj.text || "";

        // Clean any odd spacing
        const clean = raw.replace(/\s+/g, " ").trim();
        if (!clean) continue;

        // Split by sentence terminators (. ! ?)
        const sentenceMatches = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [clean];

        for (const rawSentence of sentenceMatches) {
            const trimmed = rawSentence.trim();
            if (!trimmed || trimmed.length < 2) continue;

            // If a single sentence is overly long (> 200 chars), split on commas/semicolons
            if (trimmed.length > 200) {
                const subParts = trimmed.split(/([,;:\-—]+)/);
                let subBuffer = "";
                for (const part of subParts) {
                    if ((subBuffer + part).length < 180) {
                        subBuffer += part;
                    } else {
                        if (subBuffer.trim()) {
                            chunks.push({
                                text: subBuffer.trim(),
                                page: pageNum,
                                chapter: chapter
                            });
                        }
                        subBuffer = part;
                    }
                }
                if (subBuffer.trim()) {
                    chunks.push({
                        text: subBuffer.trim(),
                        page: pageNum,
                        chapter: chapter
                    });
                }
            } else {
                chunks.push({
                    text: trimmed,
                    page: pageNum,
                    chapter: chapter
                });
            }
        }
    }
    return chunks;
}

// Speak the current chunk in the sequence
function speakCurrentChunk() {
    if (!playerState.synth || !playerState.isPlaying) return;

    if (playerState.chunkIndex >= playerState.chunks.length) {
        // Book finished!
        const subtitle = document.getElementById("playerSubtitle");
        if (subtitle) subtitle.textContent = "Book completed! Hope you enjoyed the story.";
        setTimeout(() => stopAudiobook(), 3500);
        return;
    }

    const current = playerState.chunks[playerState.chunkIndex];
    const utterance = new SpeechSynthesisUtterance(current.text);

    if (playerState.selectedVoice) {
        utterance.voice = playerState.selectedVoice;
    }
    utterance.rate = playerState.speed;
    utterance.pitch = 1.0;

    // Update UI Elements with exact line preview
    const subtitle = document.getElementById("playerSubtitle");
    const pageBadge = document.getElementById("playerPageBadge");
    
    if (pageBadge) {
        pageBadge.textContent = `Page ${current.page}`;
    }
    if (subtitle) {
        subtitle.textContent = `"${current.text}"`;
    }

    utterance.onend = () => {
        if (playerState.isPlaying && !playerState.isPaused) {
            playerState.chunkIndex++;
            speakCurrentChunk();
        }
    };

    utterance.onerror = (e) => {
        console.warn("[Audiobook] Speech utterance error:", e);
        if (playerState.isPlaying && !playerState.isPaused) {
            playerState.chunkIndex++;
            speakCurrentChunk();
        }
    };

    playerState.synth.speak(utterance);
}

// Start playing audiobook with EXACT lines
function playAudiobook(event, bookTitle) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (!playerState.synth) {
        alert("Sorry, your browser does not support text-to-speech audio.");
        return;
    }

    // Cancel any active speech
    playerState.synth.cancel();

    // Reset button states and mark active button
    document.querySelectorAll(".audiobook-card-btn").forEach(btn => btn.classList.remove("playing"));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add("playing");
    }

    // Retrieve exact book pages from window.INDOVERSE_BOOKS
    const allBooks = window.INDOVERSE_BOOKS || {};
    let pages = allBooks[bookTitle] || allBooks[bookTitle.toUpperCase()] || [];

    if (!pages || pages.length === 0) {
        // Fallback search by partial key
        const key = Object.keys(allBooks).find(k => k.toLowerCase() === bookTitle.toLowerCase());
        if (key) pages = allBooks[key];
    }

    if (!pages || pages.length === 0) {
        alert(`Exact text for ${bookTitle} could not be loaded.`);
        return;
    }

    // Build exact speech chunks
    const chunks = buildExactSpeechChunks(pages);
    if (chunks.length === 0) {
        alert(`No readable text found in ${bookTitle}.`);
        return;
    }

    playerState.currentBook = bookTitle;
    playerState.chunks = chunks;
    playerState.chunkIndex = 0;
    playerState.isPlaying = true;
    playerState.isPaused = false;

    // Show and update Player Bar
    const playerBar = document.getElementById("audioPlayer");
    const titleEl = document.getElementById("playerBookTitle");
    const playPauseIcon = document.getElementById("playPauseIcon");
    const speedBtn = document.getElementById("playerSpeedBtn");
    const pageBadge = document.getElementById("playerPageBadge");

    if (playerBar) playerBar.classList.remove("hidden");
    if (titleEl) titleEl.textContent = bookTitle;
    if (pageBadge) pageBadge.textContent = `Page ${chunks[0].page}`;
    if (playPauseIcon) {
        playPauseIcon.classList.remove("fa-play");
        playPauseIcon.classList.add("fa-pause");
    }
    if (speedBtn) speedBtn.textContent = `${playerState.speed}x`;

    initVoices();
    speakCurrentChunk();
}

// Toggle Play / Pause
function toggleAudiobookPlayPause() {
    if (!playerState.synth || !playerState.isPlaying) return;

    const playPauseIcon = document.getElementById("playPauseIcon");
    const subtitle = document.getElementById("playerSubtitle");

    if (playerState.isPaused) {
        // Resume
        playerState.synth.resume();
        playerState.isPaused = false;
        if (playPauseIcon) {
            playPauseIcon.classList.remove("fa-play");
            playPauseIcon.classList.add("fa-pause");
        }
        if (subtitle && playerState.chunks[playerState.chunkIndex]) {
            subtitle.textContent = `"${playerState.chunks[playerState.chunkIndex].text}"`;
        }
    } else {
        // Pause
        playerState.synth.pause();
        playerState.isPaused = true;
        if (playPauseIcon) {
            playPauseIcon.classList.remove("fa-pause");
            playPauseIcon.classList.add("fa-play");
        }
        if (subtitle) {
            subtitle.textContent = "Paused";
        }
    }
}

// Skip to Next sentence
function nextAudiobookChunk() {
    if (!playerState.isPlaying || !playerState.synth) return;
    if (playerState.chunkIndex < playerState.chunks.length - 1) {
        playerState.synth.cancel();
        playerState.chunkIndex++;
        playerState.isPaused = false;
        const playPauseIcon = document.getElementById("playPauseIcon");
        if (playPauseIcon) {
            playPauseIcon.classList.remove("fa-play");
            playPauseIcon.classList.add("fa-pause");
        }
        speakCurrentChunk();
    }
}

// Skip to Previous sentence
function prevAudiobookChunk() {
    if (!playerState.isPlaying || !playerState.synth) return;
    if (playerState.chunkIndex > 0) {
        playerState.synth.cancel();
        playerState.chunkIndex--;
        playerState.isPaused = false;
        const playPauseIcon = document.getElementById("playPauseIcon");
        if (playPauseIcon) {
            playPauseIcon.classList.remove("fa-play");
            playPauseIcon.classList.add("fa-pause");
        }
        speakCurrentChunk();
    }
}

// Cycle playback speed (1x -> 1.25x -> 1.5x -> 2x)
function cycleAudiobookSpeed() {
    playerState.speedIndex = (playerState.speedIndex + 1) % playerState.speedOptions.length;
    playerState.speed = playerState.speedOptions[playerState.speedIndex];

    const speedBtn = document.getElementById("playerSpeedBtn");
    if (speedBtn) speedBtn.textContent = `${playerState.speed}x`;

    // Restart current sentence chunk with the new speed
    if (playerState.isPlaying && !playerState.isPaused && playerState.synth) {
        playerState.synth.cancel();
        speakCurrentChunk();
    }
}

// Stop and close player bar
function stopAudiobook() {
    if (playerState.synth) {
        playerState.synth.cancel();
    }
    playerState.isPlaying = false;
    playerState.isPaused = false;
    playerState.chunkIndex = 0;
    playerState.currentBook = null;

    const playerBar = document.getElementById("audioPlayer");
    if (playerBar) playerBar.classList.add("hidden");

    document.querySelectorAll(".audiobook-card-btn").forEach(btn => btn.classList.remove("playing"));
}


