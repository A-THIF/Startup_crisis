document.addEventListener("DOMContentLoaded", function() {
  const burgerToggle = document.getElementById("burger-toggle");
  const sideMenu = document.querySelector(".side-menu");
  const overlay = document.querySelector(".overlay");

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
      burgerToggle.checked = false;  // Uncheck the burger toggle
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
  });

  // Game navigation function
  function navigateToGame() {
      const container = document.querySelector('.container');
      const newPage = document.querySelector('.new-page');
      
      container.classList.add('fade-out');
      
      setTimeout(() => {
          container.style.display = 'none';
          newPage.style.display = 'flex';
          newPage.classList.add('fade-in');
      }, 300);
  }

  function handleSignIn() {
      alert('Sign In clicked');
  }

  function handleLogin() {
      alert('Login clicked');
  }

  // Add event listeners for buttons
  document.querySelector('.play-button').addEventListener('click', navigateToGame);
  document.querySelector('button[onclick="handleSignIn()"]').addEventListener('click', handleSignIn);
  document.querySelector('button[onclick="handleLogin()"]').addEventListener('click', handleLogin);
});

function toggleMenu() {
    const header = document.querySelector('.header');
    const sideMenu = document.querySelector('.side-menu');
    header.classList.toggle('expanded');
    sideMenu.classList.toggle('expanded');
}
