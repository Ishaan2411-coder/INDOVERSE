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
//   INDOVERSE AI ORACLE    //
// ======================== //

// Lore database loaded from JSON
let LORE_DB = null;

async function loadLoreDB() {
    try {
        const resp = await fetch("lore_database.json");
        LORE_DB = await resp.json();
        console.log("[AI Oracle] Lore DB loaded:", LORE_DB.length, "chunks");
    } catch (e) {
        console.warn("[AI Oracle] Could not load lore_database.json:", e);
    }
}

// Load on page start
loadLoreDB();

const aiLauncher = document.getElementById("aiLauncher");
const aiChatWindow = document.getElementById("aiChatWindow");
const aiCloseBtn = document.getElementById("aiCloseBtn");
const aiInputForm = document.getElementById("aiInputForm");
const aiInput = document.getElementById("aiInput");
const aiMessages = document.getElementById("aiMessages");

if (aiLauncher && aiChatWindow) {
    aiLauncher.addEventListener("click", () => {
        aiChatWindow.classList.toggle("hidden");
        if (!aiChatWindow.classList.contains("hidden")) aiInput.focus();
    });
}

if (aiCloseBtn) {
    aiCloseBtn.addEventListener("click", () => aiChatWindow.classList.add("hidden"));
}

function askSuggestion(questionText) {
    if (aiInput) {
        aiInput.value = questionText;
        processAiQuestion(questionText);
    }
}

if (aiInputForm) {
    aiInputForm.addEventListener("submit", e => {
        e.preventDefault();
        const text = aiInput.value.trim();
        if (text) {
            processAiQuestion(text);
            aiInput.value = "";
        }
    });
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `ai-msg ${sender}`;
    const avatarDiv = document.createElement("div");
    avatarDiv.className = "msg-avatar";
    avatarDiv.innerHTML = sender === "bot"
        ? '<i class="fa-solid fa-robot"></i>'
        : '<i class="fa-solid fa-user"></i>';
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "msg-bubble";
    bubbleDiv.innerHTML = text;
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    aiMessages.appendChild(msgDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return msgDiv;
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

// Clean messy PDF spacing (single letters on separate lines merged)
function cleanPdfText(text) {
    // Replace multiple spaces with single space
    return text.replace(/\s{2,}/g, " ").trim();
}

// SEARCH ENGINE: score each lore chunk against query
function searchLore(query) {
    if (!LORE_DB || LORE_DB.length === 0) return null;

    const STOP = new Set(["kya","hai","tha","thi","mein","kaise","kaun","kahan",
        "bhai","please","tell","about","what","who","how","did","the","and",
        "for","was","had","has","ne","ki","ko","ka","se","par","aur","wo","ye",
        "ek","hi","toh","woh","jab","tha","bhi","nahi","koi","kuch","uska",
        "uski","apna","apni","mere","mera","main","hum","unka","unki","yeh","iss"]);

    const queryWords = query.toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP.has(w));

    if (queryWords.length === 0) return null;

    const results = LORE_DB.map(chunk => {
        const text = chunk.text.toLowerCase();
        let score = 0;

        for (const word of queryWords) {
            // Exact word count
            const count = (text.match(new RegExp(`\\b${word}`, "g")) || []).length;
            score += count * 2;
            // Partial match (word starts with)
            if (count === 0 && text.includes(word)) score += 1;
        }

        // Bonus: matched words from multiple query keywords
        const matchedCount = queryWords.filter(w => text.includes(w)).length;
        if (matchedCount >= 2) score += matchedCount * 3;

        return { chunk, score };
    });

    results.sort((a, b) => b.score - a.score);
    return results.filter(r => r.score > 0).slice(0, 4);
}

// Extract best sentences from text that contain query words
function extractBestSentences(text, queryWords, maxLen = 400) {
    const clean = cleanPdfText(text);
    // Split on sentence-like boundaries
    const sentences = clean.split(/(?<=[.!?"'])\s+|(?<=\.)(?=[A-Zऀ-ॿ])/);
    const scored = sentences.map(s => {
        const sl = s.toLowerCase();
        const hits = queryWords.filter(w => sl.includes(w)).length;
        return { s, hits };
    });
    scored.sort((a, b) => b.hits - a.hits);
    let out = "";
    for (const { s } of scored) {
        if ((out + " " + s).trim().length <= maxLen) {
            out = (out + " " + s).trim();
        } else break;
    }
    return out || clean.substring(0, maxLen);
}

// Build a smart answer from lore search
function buildLoreAnswer(query, topResults) {
    if (!topResults || topResults.length === 0) return null;

    const best = topResults[0];
    if (best.score < 3) return null;

    const STOP = new Set(["kya","hai","tha","thi","mein","kaise","kaun","kahan",
        "bhai","please","tell","about","what","who","how","did","the","and",
        "for","was","had","has","ne","ki","ko","ka","se","par","aur","wo","ye"]);
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));

    // Build response from top results
    const seen = new Set();
    let response = "";

    for (const result of topResults) {
        const { chunk } = result;
        if (seen.has(chunk.book + chunk.page)) continue;
        seen.add(chunk.book + chunk.page);

        const excerpt = extractBestSentences(chunk.text, queryWords, 350);
        const chapterClean = cleanPdfText(chunk.chapter);

        if (!response) {
            response = `📚 <strong>${chunk.book}</strong> — <em>${chapterClean}</em><br><br>${excerpt}`;
        } else if (chunk.book !== topResults[0].chunk.book) {
            // Second book reference
            response += `<br><br>📖 <em>Related — <strong>${chunk.book}</strong>, ${chapterClean}:</em><br>${excerpt.substring(0, 220)}...`;
            break;
        }
    }

    return response || null;
}

// Out-of-reach topics (genuine off-topic queries)
const OUT_OF_REACH_PATTERN = /\b(math|2\+2|solve|calcul|python\s+code|javascript\s+code|java\s+code|program|modi|trump|biden|kohli|cricket\s+score|bollywood\s+film|weather\s+today|temperature|capital\s+of|currency|stock\s+market|news\s+today)\b/i;

function processAiQuestion(userQuery) {
    appendMessage("user", escapeHtml(userQuery));

    // Typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "ai-msg bot";
    typingDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble"><em>Searching Indoverse archives...</em></div>
    `;
    aiMessages.appendChild(typingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    setTimeout(() => {
        typingDiv.remove();

        const q = userQuery.toLowerCase();

        // Check hard out-of-reach
        if (OUT_OF_REACH_PATTERN.test(q)) {
            appendMessage("bot", `⚠️ <strong>Reach Se Bahar / Out of Reach</strong><br><br>
Yeh sawaal mere domain se bahar hai! Main sirf <strong>INDOVERSE</strong> ki books, characters, aur story ke baare mein bata sakta hoon.<br><br>
<em>This question is outside my reach. I am the INDOVERSE AI Oracle — trained only on the stories, characters, and lore of the Indoverse universe.</em>`);
            return;
        }

        // Try lore DB search first
        const loreResults = searchLore(userQuery);
        const loreAnswer = buildLoreAnswer(userQuery, loreResults);

        if (loreAnswer) {
            appendMessage("bot", loreAnswer);
            return;
        }

        // Fall back to curated known facts
        const fallback = getKnownFact(q);
        if (fallback) {
            appendMessage("bot", fallback);
            return;
        }

        // Generic fallback
        appendMessage("bot", `🌌 <strong>INDOVERSE ORACLE</strong><br><br>
Mujhe is sawaal ka jawab abhi clearly nahi mila. Zyada specific poochho, jaise:<br>
• Koi character ka naam (Ishaan, Om, Mikhail, Gauri, Avika...)<br>
• Koi book ka naam (Sahay, Glitch, Navmani, Destiny...)<br>
• Koi scene ya event<br><br>
<em>Try rephrasing with specific names or book titles!</em>`);
    }, 450);
}

// Curated known facts for common quick questions
function getKnownFact(q) {
    // Reading order
    if (/start|order|pehle|first|list all|kitni books/.test(q)) {
        return `📖 <strong>INDOVERSE READING ORDER</strong><br><br>
<strong>⚡ Phase 1:</strong><br>
1️⃣ SAHAY → 2️⃣ INDOVAR → 3️⃣ PARADOX → 4️⃣ FRACTURE → 5️⃣ ASCENT<br><br>
<strong>🌟 Phase 2:</strong><br>
6️⃣ SANJIVANI → 7️⃣ GLITCH → 8️⃣ NAVMANI → 9️⃣ MISSION ANTIDOTE → 🔟 DESTINY<br><br>
<strong>🇬🇧 English Editions:</strong> INDOVERSE Vol 1 & Vol 2`;
    }

    // Author
    if (/author|creator|kisne likha|wrote|writer|ishaan kr|singh/.test(q)) {
        return `✍️ <strong>AUTHOR</strong><br><br>INDOVERSE ko <strong>Ishaan Kr. Singh</strong> (Class 11 student) ne likha hai. Ye ek Hinglish + English cinematic story universe hai.`;
    }

    // Characters list
    if (/characters|sabhi log|sab kaun|main cast|cast/.test(q)) {
        return `👥 <strong>INDOVERSE MAIN CHARACTERS</strong><br><br>
• <strong>Ishaan</strong> — AIR 1 JEE Topper, SAHAY AI & Waqt Rath creator, IKS founder<br>
• <strong>Om</strong> — Phase 2 protagonist, Waqt-Bandh & Navmani master<br>
• <strong>Bhuvan</strong> — Ishaan's elder brother, IKS leader, Mikhail's husband<br>
• <strong>Mikhail</strong> — Russian Harvard professor, ancient languages expert (martyred in Destiny)<br>
• <strong>Kenji</strong> — Harvard Robotics genius, Ishaan's mentor<br>
• <strong>Avika</strong> — Ishaan's loyal friend, CA<br>
• <strong>Gauri</strong> — IKS lab scientist, Om's close partner<br>
• <strong>Anjali</strong> — Kenji's wife (died in Paradox, inspired Waqt Rath)`;
    }

    // Phase info
    if (/phase 1|phase1/.test(q) && !/phase 2|phase2/.test(q)) {
        return `📚 <strong>PHASE 1</strong><br><br>
1. <strong>SAHAY</strong> — Ishaan, SAHAY AI, Jitendar villain, Avika<br>
2. <strong>INDOVAR</strong> — Harvard, Prof. Kenji, Prof. Mikhail, Indovar signals<br>
3. <strong>PARADOX</strong> — Anjali dies, Waqt Rath invention, Nebula & Void<br>
4. <strong>FRACTURE</strong> — IKS founded, Red Portals, Multiverse Cracks<br>
5. <strong>ASCENT</strong> — Om enters, Ishaan's cosmic ascension`;
    }

    if (/phase 2|phase2/.test(q)) {
        return `🌟 <strong>PHASE 2 (LIVE FOR FREE)</strong><br><br>
6. <strong>SANJIVANI</strong> (Gold) — Dimensional Nexus, cosmic revival<br>
7. <strong>GLITCH</strong> (Electric Blue) — Kolkata trip, Demons Universe breach<br>
8. <strong>NAVMANI</strong> (Grey) — Deep Freeze Chamber, 9 sacred gems quest<br>
9. <strong>MISSION ANTIDOTE</strong> (Purple) — Anniversary, Antidote mission launch<br>
10. <strong>DESTINY</strong> (Red) — Mikhail's sacrifice, Multiverse saved`;
    }

    return null;
}
