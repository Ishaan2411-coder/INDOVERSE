// SCROLL TO BOOKS
function scrollToBooks(){
    document.getElementById("books").scrollIntoView({
        behavior:"smooth"
    });
}

// ACCORDION
const accordions = document.querySelectorAll(".accordion-btn");
accordions.forEach(button => {
    button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        content.classList.toggle("active");
        button.classList.toggle("active");
    });
});

// STAR RATING INPUT
const starInput = document.getElementById("starInput");
const ratingField = document.getElementById("fbRating");
if(starInput){
    const stars = starInput.querySelectorAll("i");

    stars.forEach(star => {
        star.addEventListener("mouseenter", () => {
            const val = parseInt(star.dataset.val);
            stars.forEach(s => {
                s.classList.toggle("hovered", parseInt(s.dataset.val) <= val);
            });
        });

        star.addEventListener("mouseleave", () => {
            stars.forEach(s => s.classList.remove("hovered"));
        });

        star.addEventListener("click", () => {
            const val = parseInt(star.dataset.val);
            ratingField.value = val;
            stars.forEach(s => {
                if(parseInt(s.dataset.val) <= val){
                    s.classList.add("selected");
                    s.className = "fa-solid fa-star selected";
                } else {
                    s.classList.remove("selected");
                    s.className = "fa-regular fa-star";
                }
            });
        });
    });
}

// FEEDBACK DATABASE (localStorage)
const FB_KEY = "indoverse_feedback_db";

function getFeedbacks(){
    try{
        const d = localStorage.getItem(FB_KEY);
        return d ? JSON.parse(d) : [];
    } catch(e){ return []; }
}

function saveFeedbacks(list){
    localStorage.setItem(FB_KEY, JSON.stringify(list));
}

function esc(s){
    return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));
}

function updateAvg(){
    const list = getFeedbacks();
    const el = document.getElementById("fbAvgNumber");
    const starsEl = document.getElementById("fbAvgStars");
    const countEl = document.getElementById("fbCount");
    if(!el) return;

    const ratings = list.filter(f => f.rating > 0).map(f => f.rating);
    const avg = ratings.length > 0 ? (ratings.reduce((a,b)=>a+b,0)/ratings.length) : 0;

    el.textContent = avg.toFixed(1);
    countEl.textContent = list.length + " review" + (list.length !== 1 ? "s" : "");

    // render avg stars
    if(starsEl){
        let html = "";
        for(let i = 1; i <= 5; i++){
            if(i <= Math.round(avg)){
                html += '<i class="fa-solid fa-star"></i>';
            } else {
                html += '<i class="fa-regular fa-star"></i>';
            }
        }
        starsEl.innerHTML = html;
    }
}

function renderStars(n){
    let html = "";
    for(let i = 1; i <= 5; i++){
        html += i <= n ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    }
    return html;
}

function renderFeedbacks(){
    const el = document.getElementById("fbList");
    if(!el) return;
    const list = getFeedbacks();

    if(list.length === 0){
        el.innerHTML = '<div class="fb-empty">NO FEEDBACK YET — BE THE FIRST!</div>';
        updateAvg();
        return;
    }

    el.innerHTML = "";
    list.forEach(fb => {
        const d = document.createElement("div");
        d.className = "fb-entry";
        d.innerHTML = `
            <div class="fb-entry-head">
                <span class="fb-entry-name">${esc(fb.name)}</span>
                <span class="fb-entry-book ${fb.book.toLowerCase()}">${esc(fb.book)}</span>
                <span class="fb-entry-stars">${renderStars(fb.rating || 0)}</span>
                <span class="fb-entry-date">${esc(fb.date)}</span>
            </div>
            <p class="fb-entry-msg">${esc(fb.message)}</p>
            <button class="fb-del" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
        `;
        d.querySelector(".fb-del").addEventListener("click", () => {
            let arr = getFeedbacks().filter(x => x.id !== fb.id);
            saveFeedbacks(arr);
            renderFeedbacks();
        });
        el.appendChild(d);
    });

    updateAvg();
}

// FORM SUBMIT
const fbForm = document.getElementById("feedbackForm");
if(fbForm){
    fbForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("fbName").value.trim();
        const book = document.getElementById("fbBook").value;
        const rating = parseInt(document.getElementById("fbRating").value) || 0;
        const message = document.getElementById("fbMessage").value.trim();
        if(!name || !book || !message) return;

        const entry = {
            id: Date.now().toString(),
            name, book, rating, message,
            date: new Date().toLocaleDateString(undefined, {
                month:'short', day:'numeric', year:'numeric'
            })
        };

        const list = getFeedbacks();
        list.unshift(entry);
        saveFeedbacks(list);

        fbForm.reset();
        // reset star visuals
        if(starInput){
            starInput.querySelectorAll("i").forEach(s => {
                s.className = "fa-regular fa-star";
            });
        }
        document.getElementById("fbRating").value = "0";

        const msg = document.getElementById("fbSuccess");
        if(msg){
            msg.style.display = "block";
            setTimeout(() => { msg.style.display = "none"; }, 3000);
        }
        renderFeedbacks();
    });
}

renderFeedbacks();
