    // State management
    let selectedBusiness = '';

    // Business selection handler
    function selectBusiness(type) {
        selectedBusiness = type;
        
        // Reset all cards
        document.querySelectorAll('.business-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Highlight selected card
        const selectedCard = document.querySelector(`[onclick="selectBusiness('${type}')"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        validateInput();
    }

    // Input validation
    function validateInput() {
        const companyName = document.getElementById('companyName').value.trim();
        const startButton = document.getElementById('startButton');
        startButton.disabled = !companyName || !selectedBusiness;
    }

    // Game initialization
    function startGame() {
        const companyName = document.getElementById('companyName').value;
        // Store company name in localStorage
        localStorage.setItem('companyName', companyName);
        
        // Instead of redirecting to gameflow, show the appropriate service page
        const pageId = selectedBusiness + 'Page';
        
        // Hide main page
        document.getElementById('mainPage').style.display = 'none';
        
        // Show the corresponding service selection page
        showServiceOptions(pageId);
    }

    // Add initial animation
    document.querySelectorAll('.business-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Track selected option
    let selectedOption = '';

    // Add click handlers to all option buttons
    document.querySelectorAll('.option-button').forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all options in this container
            this.parentElement.querySelectorAll('.option-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Add selected class to clicked button
            this.classList.add('selected');
            selectedOption = this.textContent;
        });
    });

// Add click handlers to all continue buttons
document.querySelectorAll('.continue-button').forEach(button => {
    button.addEventListener('click', function() {
        // Check if an option is selected
        const container = this.closest('.page-container');
        const selectedOption = container.querySelector('.option-button.selected');
        
        if (selectedOption) {
            // Store the selection
            localStorage.setItem('selectedService', selectedOption.textContent);
            
            // Navigate to gameflow using Django URL
            window.location.href = '/gameflow';
        } else {
            alert('Please select an option before continuing');
        }
    });
});

    function showServiceOptions(pageId) {
        const page = document.getElementById(pageId);
        const options = page.querySelectorAll('.option-button, .continue-button');
        
        // Set initial state
        options.forEach(option => {
            option.style.opacity = '0';
            option.style.transform = 'translateY(20px)';
        });

        // Show the page first
        page.style.display = 'block';

        // Animate each option
        options.forEach((option, index) => {
            setTimeout(() => {
                option.style.transition = 'all 0.5s ease';
                option.style.opacity = '1';
                option.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    