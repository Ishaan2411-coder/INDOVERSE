document.querySelectorAll(".acc-btn").forEach(btn=>{
    btn.onclick=()=>{
        let c=btn.nextElementSibling;
        c.style.display=c.style.display==="block"?"none":"block";
    };
});
