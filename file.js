const menuButton = document.getElementById("menuButton");

const menu = document.getElementById("menu");

menuButton.addEventListener("click", () => {

    menu.style.display = (menu.style.display === "block") ? "none" : "block";

});

document.addEventListener('DOMContentLoaded', () => {
    const elementsToDisable = [
        document.getElementById('AS'),
        document.querySelector('header'),
        document.querySelector('.l-logo')
    ];

    function disableRightClick(event) {
        event.preventDefault();
    }

    elementsToDisable.forEach(element => {
        if (element) {
            element.addEventListener('contextmenu', disableRightClick);
        }
    });
});
