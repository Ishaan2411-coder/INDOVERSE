function scrollToBooks(){

    document.getElementById("books").scrollIntoView({
        behavior:"smooth"
    });

}

const accordions = document.querySelectorAll(".accordion-btn");

accordions.forEach(button => {

    button.addEventListener("click", () => {

        const content = button.nextElementSibling;

        content.classList.toggle("active");

        button.classList.toggle("active");

    });

});