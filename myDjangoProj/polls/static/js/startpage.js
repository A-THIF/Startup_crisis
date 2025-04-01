document.addEventListener("DOMContentLoaded", function() {
    const burgerToggle = document.getElementById("burger-toggle");
    const sideMenu = document.querySelector(".side-menu");
    const overlay = document.querySelector(".overlay");
    const card = document.querySelector(".card");
    const signupForm = document.getElementById("signup-form");

    // Menu visibility control
    burgerToggle.addEventListener("change", function() {
        if (burgerToggle.checked) {
            sideMenu.classList.add("active");
            overlay.classList.add("active");
        } else {
            sideMenu.classList.remove("active");
            overlay.classList.remove("active");
        }
    });

    // Close menu when clicking overlay
    overlay.addEventListener("click", function() {
        burgerToggle.checked = false;
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Game navigation function
    function navigateToGame() {
        const container = document.querySelector('.container');
        const newPage = document.querySelector('.new-page');
        
        container.classList.add('fade-out');
        
        setTimeout(() => {
            container.classList.add('hidden');
            newPage.classList.remove('hidden');
            newPage.classList.add('fade-in');
        }, 300);
    }

    // Flip card function
    window.flipCard = function() {
        card.classList.toggle('flipped');
    };

    // Add event listener for play button
    document.querySelector('.play-button').addEventListener('click', navigateToGame);

    // Ensure signup button submits the form
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            const password = signupForm.querySelector('input[name="password"]').value;
            const confirmPassword = signupForm.querySelector('input[name="confirm_password"]').value;
            if (password !== confirmPassword) {
                event.preventDefault();
                alert("Passwords do not match!");
            }
        });
    }
});