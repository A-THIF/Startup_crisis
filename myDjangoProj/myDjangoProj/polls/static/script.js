function startSimulation() {
  document.getElementById("start-screen").remove();

  const body = document.body;

  const investorContainer = document.createElement("div");
  investorContainer.id = "investor-container";
  body.appendChild(investorContainer);

  const nextButton = document.createElement("button");
  nextButton.id = "next-button";
  nextButton.textContent = "Next";
  body.appendChild(nextButton);

  const investors = [
    {
      name: "Investor A",
      equityDemand: getRandomInt(10, 30),
      investmentAmount: getRandomInt(50000, 100000),
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      background: "https://source.unsplash.com/1600x900/?space,investment",
    },
    {
      name: "Investor B",
      equityDemand: getRandomInt(10, 30),
      investmentAmount: getRandomInt(50000, 100000),
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      background: "https://source.unsplash.com/1600x900/?finance,investment",
    },
    {
      name: "Investor C",
      equityDemand: getRandomInt(10, 30),
      investmentAmount: getRandomInt(50000, 100000),
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      background: "https://source.unsplash.com/1600x900/?trade,wealth",
    },
  ];

  let currentInvestorIndex = 0;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function loadInvestor(index) {
    const investor = investors[index];
    document.body.style.background = `url('${investor.background}') no-repeat center center/cover`;
    investorContainer.innerHTML = `
      <div class="investor-card">
        <img src="${investor.image}" alt="${investor.name}">
        <h2>${investor.name}</h2>
        <p>Equity Demand: <strong>${investor.equityDemand}%</strong></p>
        <p>Investment Amount: <strong>$${investor.investmentAmount.toLocaleString()}</strong></p>
        <button class="button" onclick="acceptOffer(${index})">Accept Offer</button>
        <button class="button" onclick="makeCounterOffer(${index})">Make Counter Offer</button>
      </div>
    `;
    updateButtonVisibility();
  }

  function updateButtonVisibility() {
    const previousButton = document.getElementById("previous-button");
    previousButton.style.display = currentInvestorIndex > 0 ? "inline-block" : "none";
  }

  window.acceptOffer = function(index) {
    alert(`You accepted ${investors[index].name}'s offer of ${investors[index].equityDemand}% equity for $${investors[index].investmentAmount}.`);
  }

  window.makeCounterOffer = function(index) {
    const counterOffer = prompt(`Enter your counter offer for equity (%): (Current: ${investors[index].equityDemand}%)`);
    if (counterOffer !== null && counterOffer !== "") {
      alert(`You made a counter offer of ${counterOffer}% equity to ${investors[index].name}.`);
    }
  }

  window.goToPreviousInvestor = function() {
    if (currentInvestorIndex > 0) {
      currentInvestorIndex--;
      loadInvestor(currentInvestorIndex);
      console.log("Previous button clicked, current index:", currentInvestorIndex);
    }
  }

  nextButton.addEventListener("click", function() {
    if (currentInvestorIndex < investors.length - 1) {
      currentInvestorIndex++;
      loadInvestor(currentInvestorIndex);
      console.log("Next button clicked, current index:", currentInvestorIndex);
    }
  });

  loadInvestor(currentInvestorIndex);
}