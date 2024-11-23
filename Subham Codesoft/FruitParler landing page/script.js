// script.js

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach((link) => {
        link.addEventListener('click', scrollToSection);
    });

    function scrollToSection(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            const offsetTop = targetSection.getBoundingClientRect().top + window.scrollY;
            window.scroll({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    }
});
