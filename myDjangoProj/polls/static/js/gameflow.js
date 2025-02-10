// Variables
let fund = 10000;
let equity = 100;
let revenue = 0;
let currentLevel = 1;
let isLoanActive = false;
let loanCooldown = false;
let loanAmount = 10000;
let loanInterestRate = 0;
let loanRepaymentAmount = 0;
let grantCooldown = false;
let lastGrantAmount = 0;
let reputation = 70;
let currentLoanOffer = null;
let hasUsedInvestor = false;
let businessName = '';
let currentSegment = 0;
let progress = 0;

// Investors array
const investors = [
    { name: "Tech Ventures", minEquity: 15, maxEquity: 30, preferredAmount: 50000 },
    { name: "Growth Capital", minEquity: 20, maxEquity: 40, preferredAmount: 100000 },
    { name: "Angel Group", minEquity: 10, maxEquity: 25, preferredAmount: 30000 },
    { name: "Strategic Investors", minEquity: 25, maxEquity: 45, preferredAmount: 150000 },
    { name: "Seed Fund", minEquity: 5, maxEquity: 15, preferredAmount: 25000 }
];

// Add this function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Display Update Functions
function updateFundDisplay() {
    document.getElementById('fundDisplay').innerHTML = `
        <span>Fund:</span>
        <span>₹${fund.toLocaleString()}</span>
    `;
}

function updateEquityDisplay() {
    document.getElementById('equityDisplay').innerHTML = `
        <span>Equity:</span>
        <span>${equity}%</span>
    `;
}

function updateRevenueDisplay() {
    document.getElementById('revenueDisplay').innerHTML = `
        <span>Revenue:</span>
        <span>₹${revenue.toLocaleString()}</span>
    `;
}

function updateReputationDisplay() {
    const fill = document.getElementById('reputationFill');
    const text = document.getElementById('reputationText');
    
    fill.style.width = `${reputation}%`;
    
    if (reputation >= 80) {
        fill.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
        text.textContent = 'Excellent';
    } else if (reputation >= 60) {
        fill.style.background = 'linear-gradient(90deg, #22c55e, #10b981)';
        text.textContent = 'Good';
    } else if (reputation >= 40) {
        fill.style.background = 'linear-gradient(90deg, #eab308, #f59e0b)';
        text.textContent = 'Fair';
    } else if (reputation >= 20) {
        fill.style.background = 'linear-gradient(90deg, #f97316, #ef4444)';
        text.textContent = 'Poor';
    } else {
        fill.style.background = 'linear-gradient(90deg, #dc2626, #991b1b)';
        text.textContent = 'Critical';
    }
}

function updateProgressDisplay() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    
    fill.style.width = `${progress}%`;
    text.textContent = `${progress}%`;
}

// Investor Functions
function showInvestorModal() {
    if (hasUsedInvestor) {
        showToast('You can only use investor funding once!', 'error');
        return;
    }
    
    const modal = document.getElementById('investorInputModal');
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <h2 style="color: #1f2937; margin-bottom: 2rem;">Set Investment Terms</h2>
            <div class="term-inputs" style="max-width: 400px; margin: 0 auto;">
                <input type="number" id="capitalAmount" placeholder="Capital Amount (₹)" min="10000" step="1000">
                <input type="number" id="equityOffer" placeholder="Equity Offered (%)" max="100" min="1">
                <button class="action-btn" onclick="showInvestorOffers()">Present to Investors</button>
                <button class="action-btn" onclick="closeInvestorInputModal()" style="background: #f97316; margin-top: 0.5rem;">Close</button>
            </div>
        </div>
    `;
}

function showInvestorOffers() {
    const capitalAmount = parseInt(document.getElementById('capitalAmount').value);
    const equityOffer = parseInt(document.getElementById('equityOffer').value);
    
    if (!capitalAmount || !equityOffer) {
        showToast('Please enter both Capital Amount and Equity Offer', 'error');
        return;
    }
    
    document.getElementById('investorInputModal').style.display = 'none';
    generateInvestorResponses(capitalAmount, equityOffer);
}

function generateInvestorResponses(capitalAmount, equityOffer) {
    const offersPage = document.getElementById('investorOffersPage');
    offersPage.style.display = 'flex';
    offersPage.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 1200px; background: transparent;">
            <h1 style="color: white; font-size: 2.5rem; text-align: center; margin-bottom: 1rem;">Investor Offers</h1>
            <div style="background: rgba(67, 56, 202, 0.7); padding: 1rem; border-radius: 0.5rem; text-align: center; margin-bottom: 2rem;">
                <p style="color: white; font-size: 1.2rem;">Your Terms: ₹${capitalAmount.toLocaleString()} for ${equityOffer}% equity</p>
            </div>
            <div id="investorResponses" style="display: flex; gap: 2rem; justify-content: center; margin: 2rem 0; flex-direction: row; flex-wrap: nowrap;">
                ${investors.map(investor => generateInvestorResponse(investor, capitalAmount, equityOffer)).join('')}
            </div>
            <button class="action-btn" onclick="closeInvestorPage()" style="position: absolute; top: 1rem; right: 1rem; width: auto; background: transparent; font-size: 1.5rem;">&times;</button>
        </div>
    `;
}

function generateInvestorResponse(investor, amount, equity) {
    const interested = isInvestorInterested(investor, amount, equity);
    const response = interested ? getInterestResponse(investor, amount, equity) : "Equity offer too low";
    const responseColor = interested ? "#22c55e" : "#ef4444";

    return `
        <div class="investor-response" style="background: white; padding: 1.5rem; border-radius: 0.5rem; width: 220px; text-align: center;">
            <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.2rem;">${investor.name}</h3>
            <div style="margin: 1rem 0; text-align: left;">
                <p style="color: #6b7280; margin-bottom: 0.5rem;">Investment Range:</p>
                <p style="color: #1f2937;">₹${investor.preferredAmount.toLocaleString()}</p>
                <p style="color: #6b7280; margin-bottom: 0.5rem; margin-top: 1rem;">Equity Range:</p>
                <p style="color: #1f2937;">${investor.minEquity}% - ${investor.maxEquity}%</p>
                <p style="color: ${responseColor}; margin-top: 1rem; font-weight: 500;">${response}</p>
            </div>
            ${interested ? `
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="action-btn" onclick="acceptOffer('${investor.name}', ${amount}, ${equity})" 
                        style="flex: 1; background: #f97316; padding: 0.5rem; font-size: 0.9rem;">ACCEPT</button>
                    <button class="action-btn" onclick="showNegotiation('${investor.name}', ${amount}, ${equity}, ${amount}, ${equity})" 
                        style="flex: 1; background: #6366f1; padding: 0.5rem; font-size: 0.9rem;">Negotiate</button>
                </div>
            ` : ''}
        </div>
    `;
}

function getInterestResponse(investor, amount, equity) {
    if (equity < investor.minEquity) {
        return "Equity offer too low";
    }
    if (equity > investor.maxEquity) {
        return "Equity offer too high";
    }
    if (amount < investor.preferredAmount * 0.7) {
        return "Amount too low";
    }
    if (amount > investor.preferredAmount * 1.3) {
        return "Amount too high";
    }
    return `Interested, but wants ${Math.min(investor.maxEquity, equity + 5)}% equity`;
}

function showNegotiation(investorName, originalAmount, originalEquity, newAmount, newEquity) {
    document.getElementById('investorOffersPage').style.display = 'none';
    
    const negotiationPage = document.getElementById('negotiationPage');
    negotiationPage.style.display = 'flex';
    negotiationPage.style.justifyContent = 'center';
    negotiationPage.style.alignItems = 'center';
    negotiationPage.innerHTML = `
        <div class="modal-content" style="width: 400px; position: relative; background: white;">
            <h2 style="color: #1f2937; margin-bottom: 2rem; font-size: 1.5rem;">Negotiation with ${investorName}</h2>
            <div class="terms-display" style="text-align: center;">
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(0,0,0,0.05); border-radius: 0.5rem;">
                    <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.2rem;">Original Terms</h3>
                    <p style="margin: 0.5rem 0;">Amount: ₹${originalAmount.toLocaleString()}</p>
                    <p style="margin: 0.5rem 0;">Equity: ${originalEquity}%</p>
                </div>
                <div style="margin: 2rem 0; padding: 1rem; background: rgba(0,0,0,0.05); border-radius: 0.5rem;">
                    <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.2rem;">Counter Offer</h3>
                    <p style="margin: 0.5rem 0;">Amount: ₹${newAmount.toLocaleString()}</p>
                    <p style="margin: 0.5rem 0;">Equity: ${newEquity}%</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 2rem;">
                    <button class="action-btn" onclick="acceptOffer('${investorName}', ${newAmount}, ${newEquity})" 
                        style="width: 200px; background: #f97316;">Accept Counter Offer</button>
                    <button class="action-btn" onclick="closeNegotiationPage()" 
                        style="width: 200px; background: #f97316;">Decline</button>
                </div>
            </div>
        </div>
    `;
}

function closeNegotiationPage() {
    document.getElementById('negotiationPage').style.display = 'none';
    document.getElementById('investorOffersPage').style.display = 'flex';
}

function acceptOffer(investorName, amount, equityGiven) {
    fund += amount;
    equity -= equityGiven;
    hasUsedInvestor = true;
    
    updateFundDisplay();
    updateEquityDisplay();
    updateInvestorButton();
    
    document.getElementById('investorOffersPage').style.display = 'none';
    document.getElementById('negotiationPage').style.display = 'none';
    
    const acceptancePopup = document.getElementById('acceptancePopup');
    acceptancePopup.style.display = 'flex';
    acceptancePopup.innerHTML = `
        <div class="modal-content" style="width: 400px; position: relative;">
            <h2 style="color: #1f2937; margin-bottom: 2rem;">Deal Accepted!</h2>
            <div style="margin: 1.5rem 0; text-align: center;">
                <p style="margin: 0.5rem 0;">Investor: ${investorName}</p>
                <p style="margin: 0.5rem 0;">Amount: ₹${amount.toLocaleString()}</p>
                <p style="margin: 0.5rem 0;">Equity Given: ${equityGiven}%</p>
            </div>
            <button class="action-btn" onclick="document.getElementById('acceptancePopup').style.display='none'"
                style="width: 200px; margin: 1rem auto 0;">Close</button>
        </div>
    `;
}

function closeInvestorInputModal() {
    document.getElementById('investorInputModal').style.display = 'none';
}

function closeInvestorPage() {
    document.getElementById('investorOffersPage').style.display = 'none';
}

// Loan Functions
function generateLoanOffer() {
    const amounts = [10000, 25000, 50000, 75000, 100000];
    const baseInterest = 0.10; // 10%
    
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    const randomInterest = baseInterest + (Math.random() * 0.15); // 10% to 25%
    
    return {
        amount: randomAmount,
        interestRate: randomInterest
    };
}

function showLoanModal() {
    if (loanCooldown) {
        showToast('Loan is on cooldown. Please wait.', 'info');
        return;
    }
    if (isLoanActive) {
        showToast('You already have an active loan!', 'error');
        return;
    }
    
    if (!currentLoanOffer) {
        currentLoanOffer = generateLoanOffer();
    }
    
    const modal = document.getElementById('loanModal');
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <h2 style="color: #1f2937; margin-bottom: 2rem;">Available Loan</h2>
            <div class="loan-offer" style="background: rgba(0,0,0,0.05); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 2rem;">
                <p style="font-size: 1.2rem; margin-bottom: 1rem;">Current Offer:</p>
                <p>Amount: ₹${currentLoanOffer.amount.toLocaleString()}</p>
                <p>Interest Rate: ${(currentLoanOffer.interestRate * 100).toFixed(1)}%</p>
                <p>Repayment Amount: ₹${(currentLoanOffer.amount * (1 + currentLoanOffer.interestRate)).toLocaleString()}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <button class="action-btn" onclick="takeLoan(${currentLoanOffer.amount}, ${currentLoanOffer.interestRate})">
                    Accept Loan
                </button>
                <button class="action-btn" onclick="document.getElementById('loanModal').style.display='none'" style="background: #f97316;">
                    Decline
                </button>
            </div>
        </div>
    `;
}

function takeLoan(amount, interestRate) {
    if (isLoanActive) {
        showToast('You already have an active loan!', 'error');
        return;
    }
    
    loanAmount = amount;
    loanInterestRate = interestRate;
    loanRepaymentAmount = Math.floor(amount * (1 + interestRate));
    
    fund += amount;
    isLoanActive = true;
    currentLoanOffer = null;
    
    updateFundDisplay();
    updateRepayButton();
    updateLoanButton();
    
    document.getElementById('loanModal').style.display = 'none';
    
    const acceptancePopup = document.getElementById('loanAcceptancePopup');
    acceptancePopup.style.display = 'flex';
    acceptancePopup.innerHTML = `
        <div class="modal-content">
            <h2 style="color: #1f2937; margin-bottom: 2rem;">Loan Approved!</h2>
            <div style="margin: 1.5rem 0; text-align: center;">
                <p>Amount: ₹${amount.toLocaleString()}</p>
                <p>Interest Rate: ${(interestRate * 100).toFixed(1)}%</p>
                <p>Repayment Amount: ₹${loanRepaymentAmount.toLocaleString()}</p>
            </div>
            <button class="action-btn" onclick="document.getElementById('loanAcceptancePopup').style.display='none'">
                Close
            </button>
        </div>
    `;
}

function repayLoan() {
    if (!isLoanActive) {
        showToast('No active loan to repay!', 'error');
        return;
    }
    
    if (fund >= loanRepaymentAmount) {
        fund -= loanRepaymentAmount;
        isLoanActive = false;
        loanCooldown = true;
        
        updateFundDisplay();
        updateRepayButton();
        updateLoanButton();
        
        const repaymentPopup = document.getElementById('loanRepaymentPopup');
        repaymentPopup.style.display = 'flex';
        repaymentPopup.innerHTML = `
            <div class="modal-content">
                <h2 style="color: #1f2937; margin-bottom: 2rem;">Loan Repaid Successfully!</h2>
                <div style="margin: 1.5rem 0; text-align: center;">
                    <p>Amount Repaid: ₹${loanRepaymentAmount.toLocaleString()}</p>
                    <p>Interest Paid: ₹${(loanRepaymentAmount - loanAmount).toLocaleString()}</p>
                    <p style="color: #ef4444; margin-top: 1rem;">Note: Loan cooldown period starting...</p>
                </div>
                <button class="action-btn" onclick="document.getElementById('loanRepaymentPopup').style.display='none'">
                    Close
                </button>
            </div>
        `;
        
        const cooldownTime = 180000; // Fixed 3 minutes cooldown
        setTimeout(() => {
            loanCooldown = false;
            updateLoanButton();
            showToast('Loan is now available again!', 'info');
        }, cooldownTime);
    } else {
        const repaymentPopup = document.getElementById('loanRepaymentPopup');
        repaymentPopup.style.display = 'flex';
        repaymentPopup.innerHTML = `
            <div class="modal-content">
                <h2 style="color: #dc2626; margin-bottom: 2rem;">Insufficient Funds!</h2>
                <div style="margin: 1.5rem 0; text-align: center;">
                    <p>Current Balance: ₹${fund.toLocaleString()}</p>
                    <p>Required Amount: ₹${loanRepaymentAmount.toLocaleString()}</p>
                    <p>Shortfall: ₹${(loanRepaymentAmount - fund).toLocaleString()}</p>
                    <p style="color: #ef4444; margin-top: 1rem;">Please acquire more funds to repay the loan.</p>
                </div>
                <button class="action-btn" onclick="document.getElementById('loanRepaymentPopup').style.display='none'">
                    Close
                </button>
            </div>
        `;
    }
}

function updateRepayButton() {
    const repayButton = document.getElementById('repayLoanBtn');
    if (isLoanActive) {
        repayButton.style.opacity = '1';
        repayButton.style.pointerEvents = 'auto';
    } else {
        repayButton.style.opacity = '0.5';
        repayButton.style.pointerEvents = 'none';
    }
}

function updateLoanButton() {
    const loanButton = document.querySelector('.building-section .action-btn:nth-child(2)');
    if (loanCooldown || isLoanActive) {
        loanButton.style.opacity = '0.5';
        loanButton.style.pointerEvents = 'none';
    } else {
        loanButton.style.opacity = '1';
        loanButton.style.pointerEvents = 'auto';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const sideNav = document.querySelector('.side-nav');
    let menuOpen = false;

    menuBtn.addEventListener('click', () => {
        if(!menuOpen) {
            menuBtn.classList.add('open');
            sideNav.classList.add('open');
            menuOpen = true;
        } else {
            menuBtn.classList.remove('open');
            sideNav.classList.remove('open');
            menuOpen = false;
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (menuOpen && !sideNav.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('open');
            sideNav.classList.remove('open');
            menuOpen = false;
        }
    });

    // Existing event listeners
    document.querySelector('.building-section .action-btn:first-child').onclick = showInvestorModal;
    document.querySelector('.building-section .action-btn:nth-child(2)').onclick = showLoanModal;
    document.querySelector('.building-section .action-btn:nth-child(3)').onclick = showGrantModal;
    document.querySelector('.sell-btn').onclick = showSellModal;

    // Initial calls
    updateFundDisplay();
    updateEquityDisplay();
    updateRevenueDisplay();
    updateReputationDisplay();
    updateRepayButton();
    updateLoanButton();
    updateGrantButton();
    updateInvestorButton();

    // Update the company name in the UI
    updateCompanyName();
});

// Add this function back
function isInvestorInterested(investor, amount, equity) {
    if (equity < investor.minEquity || equity > investor.maxEquity) {
        return false;
    }
    const amountDifference = Math.abs(amount - investor.preferredAmount);
    return Math.random() > (amountDifference / investor.preferredAmount);
}

function showGrantModal() {
    if (grantCooldown) {
        showToast('Grant application is on cooldown. Please wait.', 'info');
        return;
    }

    const modal = document.getElementById('grantModal');
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="width: 800px;">
            <h2 style="color: #1f2937; margin-bottom: 2rem;">Available Government Grants</h2>
            <div class="grant-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <div class="grant-option" style="background: rgba(0,0,0,0.05); padding: 1.5rem; border-radius: 0.5rem;">
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">TANSEED Fund</h3>
                    <p style="margin-bottom: 0.5rem;">Amount: Up to ₹10,00,000</p>
                    <p style="margin-bottom: 0.5rem;">Success Rate: 60%</p>
                    <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">Early-stage equity-linked grant funds for startups</p>
                    <button class="action-btn" onclick="applyForGrant('TANSEED', 1000000, 60)" 
                        style="width: 100%;">Apply</button>
                </div>
                
                <div class="grant-option" style="background: rgba(0,0,0,0.05); padding: 1.5rem; border-radius: 0.5rem;">
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">Innovation Voucher Program</h3>
                    <p style="margin-bottom: 0.5rem;">Amount: Up to ₹5,00,000</p>
                    <p style="margin-bottom: 0.5rem;">Success Rate: 75%</p>
                    <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">Support for innovation and product development</p>
                    <button class="action-btn" onclick="applyForGrant('IVP', 500000, 75)"
                        style="width: 100%;">Apply</button>
                </div>
                
                <div class="grant-option" style="background: rgba(0,0,0,0.05); padding: 1.5rem; border-radius: 0.5rem;">
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">UYEGP Scheme</h3>
                    <p style="margin-bottom: 0.5rem;">Amount: Up to ₹3,00,000</p>
                    <p style="margin-bottom: 0.5rem;">Success Rate: 80%</p>
                    <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">Financial assistance for new ventures</p>
                    <button class="action-btn" onclick="applyForGrant('UYEGP', 300000, 80)"
                        style="width: 100%;">Apply</button>
                </div>
                
                <div class="grant-option" style="background: rgba(0,0,0,0.05); padding: 1.5rem; border-radius: 0.5rem;">
                    <h3 style="margin-bottom: 1rem; color: #1f2937;">Digital Acceleration Grant</h3>
                    <p style="margin-bottom: 0.5rem;">Amount: Up to ₹2,00,000</p>
                    <p style="margin-bottom: 0.5rem;">Success Rate: 85%</p>
                    <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">Equity-free reimbursement for digital sectors</p>
                    <button class="action-btn" onclick="applyForGrant('Digital', 200000, 85)"
                        style="width: 100%;">Apply</button>
                </div>
            </div>
            <button class="action-btn" onclick="document.getElementById('grantModal').style.display='none'"
                style="width: auto; margin: 2rem auto 0; background: #f97316;">Close</button>
        </div>
    `;
}

function applyForGrant(grantType, amount, successRate) {
    const success = Math.random() * 100 < successRate;
    document.getElementById('grantModal').style.display = 'none';
    
    if (success) {
        lastGrantAmount = amount;
        fund += amount;
        updateFundDisplay();
        
        reputation += 5;
        reputation = Math.min(reputation, 100);
        updateReputationDisplay();
        
        const successPopup = document.getElementById('grantSuccessPopup');
        successPopup.style.display = 'flex';
        successPopup.innerHTML = `
            <div class="modal-content">
                <h2 style="color: #22c55e; margin-bottom: 2rem;">Grant Approved!</h2>
                <div style="margin: 1.5rem 0; text-align: center;">
                    <p>Grant Type: ${grantType}</p>
                    <p>Amount Received: ₹${amount.toLocaleString()}</p>
                </div>
                <button class="action-btn" onclick="document.getElementById('grantSuccessPopup').style.display='none'">
                    Close
                </button>
            </div>
        `;
    } else {
        reputation -= 3;
        reputation = Math.max(reputation, 0);
        updateReputationDisplay();
        
        const failurePopup = document.getElementById('grantFailurePopup');
        failurePopup.style.display = 'flex';
        failurePopup.innerHTML = `
            <div class="modal-content">
                <h2 style="color: #dc2626; margin-bottom: 2rem;">Grant Application Failed</h2>
                <div style="margin: 1.5rem 0; text-align: center;">
                    <p>Unfortunately, your ${grantType} grant application was not successful.</p>
                    <p style="margin-top: 1rem;">Try applying for a different grant or wait for the next opportunity.</p>
                </div>
                <button class="action-btn" onclick="document.getElementById('grantFailurePopup').style.display='none'">
                    Close
                </button>
            </div>
        `;
    }
    
    grantCooldown = true;
    updateGrantButton();
    
    const cooldownTime = (Math.random() * (300 - 240) + 240) * 1000; // 4-5 minutes
    setTimeout(() => {
        grantCooldown = false;
        updateGrantButton();
        showToast('Grant applications are now available!', 'info');
    }, cooldownTime);
}

function updateGrantButton() {
    const grantButton = document.querySelector('.building-section .action-btn:nth-child(3)');
    if (grantCooldown) {
        grantButton.style.opacity = '0.5';
        grantButton.style.pointerEvents = 'none';
    } else {
        grantButton.style.opacity = '1';
        grantButton.style.pointerEvents = 'auto';
    }
}

// Add updateGrantButton to initial calls
updateGrantButton();

function showSellModal() {
    const modal = document.getElementById('sellModal');
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="background: transparent; text-align: center;">
            <h2 style="color: white; font-size: 1.8rem; margin-bottom: 2rem;">Are you sure you want to sell company?</h2>
            <div style="display: flex; justify-content: center; gap: 2rem;">
                <button onclick="endGame()" 
                    style="padding: 0.8rem 3rem; background: white; color: black; border: 2px solid white; border-radius: 0.5rem; cursor: pointer; font-size: 1.2rem;">
                    Yes
                </button>
                <button onclick="document.getElementById('sellModal').style.display='none'" 
                    style="padding: 0.8rem 3rem; background: #dc2626; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1.2rem;">
                    No
                </button>
            </div>
        </div>
    `;
}

function endGame() {
    const modal = document.getElementById('sellModal');
    modal.innerHTML = `
        <div class="modal-content" style="background: rgba(255, 255, 255, 0.95); max-width: 600px;">
            <h2 style="color: #1f2937; font-size: 2rem; margin-bottom: 2rem;">Game Over - Final Stats</h2>
            
            <div style="text-align: left; padding: 2rem; background: rgba(0,0,0,0.05); border-radius: 1rem; margin-bottom: 2rem;">
                <div style="margin-bottom: 1rem;">
                    <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Company Value</h3>
                    <p style="font-size: 1.2rem; color: #059669;">₹${fund.toLocaleString()}</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Remaining Equity</h3>
                    <p style="font-size: 1.2rem; color: #6366f1;">${equity}%</p>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Final Revenue</h3>
                    <p style="font-size: 1.2rem; color: #0891b2;">₹${revenue.toLocaleString()}</p>
                </div>
                
                <div>
                    <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Reputation</h3>
                    <p style="font-size: 1.2rem; color: #${reputation >= 70 ? '059669' : reputation >= 40 ? 'eab308' : 'dc2626'}">${reputation}%</p>
                </div>
            </div>
            
            <button onclick="window.location.href='../../'" 
                style="padding: 1rem 2rem; background: #f97316; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1.1rem;">
                Start New Game
            </button>
        </div>
    `;
}

// Add this new function
function updateInvestorButton() {
    const investorButton = document.querySelector('.building-section .action-btn:first-child');
    if (hasUsedInvestor) {
        investorButton.style.opacity = '0.5';
        investorButton.style.pointerEvents = 'none';
    } else {
        investorButton.style.opacity = '1';
        investorButton.style.pointerEvents = 'auto';
    }
}

function selectOption() {
    // Increment level
    currentLevel++;
    
    // Update level display
    document.getElementById('levelCounter').textContent = currentLevel;
    
    // Update level image based on level ranges
    const levelImage = document.getElementById('levelImage');
    if (levelImage) {
        if (currentLevel <= 10) {
            levelImage.src = `/static/images/level1.png`;
        } else if (currentLevel <= 20) {
            levelImage.src = `/static/images/level2.png`;
        } else if (currentLevel <= 30) {
            levelImage.src = `/static/images/level3.png`;
        } else {
            levelImage.src = `/static/images/level4.png`;
        }
    }
    
    // Update reputation
    reputation = Math.min(reputation + 2, 100);
    updateReputationDisplay();
}

// Update the options div in the showOptions function or wherever you create the options
function showOptions() {
    const options = document.querySelector('.options');
    options.innerHTML = `
        <button class="option-btn" onclick="selectOption()">Option 1</button>
        <button class="option-btn" onclick="selectOption()">Option 2</button>
        <button class="option-btn" onclick="selectOption()">Option 3</button>
        <button class="option-btn" onclick="selectOption()">Option 4</button>
        <div class="reload-container">
            <button class="reload-btn" onclick="window.location.reload()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                </svg>
            </button>
        </div>
    `;
}

// Modify the updateCompanyName function
function updateCompanyName() {
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        // Get company name from localStorage
        businessName = localStorage.getItem('companyName') || 'AJ Company';
        titleElement.innerHTML = `
            ${businessName} 
            <div class="level-container">
                Level <span id="levelCounter">1</span>
            </div>
        `;
    }
}

function confirmSelection() {
    // Implement the logic for confirming the selection
    console.log('Selection confirmed');
    // Remove the active class from all option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(button => button.classList.remove('active'));

    // Update the progress bar
    if (currentSegment < 9) {
        currentSegment++;
        document.getElementById(`segment${currentSegment}`).classList.add('active');
        updateProgressDisplay();
    }

    // Redirect or perform actions based on the confirmation
}

function increaseProgress() {
    if (progress < 100) {
        progress += 10; // Increase progress by 10% each time
        updateProgressDisplay();
    }
}
