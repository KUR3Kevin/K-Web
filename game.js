// Financial Education Game - Game Logic

// Game State
let gameState = {
    month: 1,
    cash: 5000,
    monthlyIncome: 3000,
    expenses: {
        rent: 1000,
        food: 400,
        transport: 200,
        utilities: 150,
        entertainment: 200
    },
    savings: {
        balance: 0,
        interestRate: 0.025, // 2.5% APY
        totalInterestEarned: 0
    },
    stocks: {
        stock1: { shares: 0, price: 100, basePrice: 100, name: "Tech Growth Inc.", volatility: 0.08 },
        stock2: { shares: 0, price: 50, basePrice: 50, name: "Stable Dividends Co.", volatility: 0.03 },
        stock3: { shares: 0, price: 75, basePrice: 75, name: "Energy Futures Ltd.", volatility: 0.06 }
    },
    debt: {
        creditCard: { balance: 0, interestRate: 0.18 },
        loan: { balance: 0, interestRate: 0.08 }
    },
    totalInvested: 0,
    history: []
};

// Initialize game on page load
window.onload = function() {
    loadGame();
    updateAllDisplays();
    setupExpenseListeners();
    logMessage("Welcome to Financial Education Game! Manage your money wisely to achieve your goals.");
};

// Setup expense input listeners
function setupExpenseListeners() {
    const expenseInputs = document.querySelectorAll('.expense-input');
    expenseInputs.forEach(input => {
        input.addEventListener('input', function() {
            const category = this.getAttribute('data-category');
            gameState.expenses[category] = parseFloat(this.value) || 0;
            updateBudgetDisplay();
        });
    });
}

// Income Management
function updateIncome() {
    const newIncome = parseFloat(document.getElementById('income-input').value);
    if (newIncome >= 0) {
        gameState.monthlyIncome = newIncome;
        updateBudgetDisplay();
        logMessage(`Monthly income updated to $${formatNumber(newIncome)}`);
    }
}

function updateBudgetDisplay() {
    const totalExpenses = Object.values(gameState.expenses).reduce((sum, val) => sum + val, 0);
    const netMonthly = gameState.monthlyIncome - totalExpenses;

    document.getElementById('income-display').textContent = `$${formatNumber(gameState.monthlyIncome)}`;
    document.getElementById('total-expenses').textContent = `$${formatNumber(totalExpenses)}`;
    document.getElementById('net-monthly').textContent = `$${formatNumber(netMonthly)}`;
    document.getElementById('monthly-income').textContent = `$${formatNumber(gameState.monthlyIncome)}`;

    // Color code net monthly income
    const netElement = document.getElementById('net-monthly');
    netElement.style.color = netMonthly >= 0 ? '#27ae60' : '#e74c3c';
}

// Savings Account Functions
function depositToSavings() {
    const amount = parseFloat(document.getElementById('savings-deposit').value);

    if (!amount || amount <= 0) {
        logMessage("Please enter a valid deposit amount", "error");
        return;
    }

    if (amount > gameState.cash) {
        logMessage("Insufficient cash for deposit", "error");
        return;
    }

    gameState.cash -= amount;
    gameState.savings.balance += amount;
    document.getElementById('savings-deposit').value = '';

    updateAllDisplays();
    logMessage(`Deposited $${formatNumber(amount)} to savings account`);
}

function withdrawFromSavings() {
    const amount = parseFloat(document.getElementById('savings-withdraw').value);

    if (!amount || amount <= 0) {
        logMessage("Please enter a valid withdrawal amount", "error");
        return;
    }

    if (amount > gameState.savings.balance) {
        logMessage("Insufficient savings balance", "error");
        return;
    }

    gameState.savings.balance -= amount;
    gameState.cash += amount;
    document.getElementById('savings-withdraw').value = '';

    updateAllDisplays();
    logMessage(`Withdrew $${formatNumber(amount)} from savings account`);
}

function calculateMonthlyInterest() {
    // Compound interest formula: A = P(1 + r/n)^(nt)
    // For monthly compounding: monthly rate = annual rate / 12
    const monthlyRate = gameState.savings.interestRate / 12;
    const interest = gameState.savings.balance * monthlyRate;

    gameState.savings.balance += interest;
    gameState.savings.totalInterestEarned += interest;

    return interest;
}

function updateSavingsDisplay() {
    document.getElementById('savings-balance').textContent = `$${formatNumber(gameState.savings.balance)}`;
    document.getElementById('total-interest').textContent = `$${formatNumber(gameState.savings.totalInterestEarned)}`;
}

// Stock/Investment Functions
function buyStock(stockId) {
    const stock = gameState.stocks[`stock${stockId}`];
    const shares = parseInt(document.getElementById(`stock${stockId}-amount`).value);

    if (!shares || shares <= 0) {
        logMessage("Please enter a valid number of shares", "error");
        return;
    }

    const cost = shares * stock.price;

    if (cost > gameState.cash) {
        logMessage(`Insufficient cash. Need $${formatNumber(cost)}`, "error");
        return;
    }

    gameState.cash -= cost;
    stock.shares += shares;
    gameState.totalInvested += cost;

    document.getElementById(`stock${stockId}-amount`).value = '';
    updateAllDisplays();
    logMessage(`Bought ${shares} shares of ${stock.name} for $${formatNumber(cost)}`);
}

function sellStock(stockId) {
    const stock = gameState.stocks[`stock${stockId}`];
    const shares = parseInt(document.getElementById(`stock${stockId}-amount`).value);

    if (!shares || shares <= 0) {
        logMessage("Please enter a valid number of shares", "error");
        return;
    }

    if (shares > stock.shares) {
        logMessage(`You only own ${stock.shares} shares`, "error");
        return;
    }

    const proceeds = shares * stock.price;
    gameState.cash += proceeds;
    stock.shares -= shares;

    document.getElementById(`stock${stockId}-amount`).value = '';
    updateAllDisplays();
    logMessage(`Sold ${shares} shares of ${stock.name} for $${formatNumber(proceeds)}`);
}

function updateStockPrices() {
    // Simulate market fluctuations
    Object.keys(gameState.stocks).forEach(key => {
        const stock = gameState.stocks[key];
        // Random walk with drift toward base price
        const change = (Math.random() - 0.5) * stock.volatility * stock.price;
        const drift = (stock.basePrice - stock.price) * 0.1; // Mean reversion
        stock.price = Math.max(10, stock.price + change + drift);
    });
}

function updateStockDisplay() {
    let portfolioValue = 0;

    Object.keys(gameState.stocks).forEach(key => {
        const stock = gameState.stocks[key];
        const stockNum = key.replace('stock', '');
        const value = stock.shares * stock.price;
        portfolioValue += value;

        document.getElementById(`stock${stockNum}-price`).textContent = formatNumber(stock.price, 2);
        document.getElementById(`stock${stockNum}-shares`).textContent = stock.shares;
        document.getElementById(`stock${stockNum}-value`).textContent = formatNumber(value);
    });

    const gainLoss = portfolioValue - gameState.totalInvested;
    const gainLossPercent = gameState.totalInvested > 0 ? (gainLoss / gameState.totalInvested * 100) : 0;

    document.getElementById('portfolio-value').textContent = `$${formatNumber(portfolioValue)}`;
    document.getElementById('total-invested').textContent = `$${formatNumber(gameState.totalInvested)}`;

    const gainLossElement = document.getElementById('portfolio-gain');
    const sign = gainLoss >= 0 ? '+' : '';
    gainLossElement.textContent = `${sign}$${formatNumber(gainLoss)} (${sign}${gainLossPercent.toFixed(1)}%)`;
    gainLossElement.style.color = gainLoss >= 0 ? '#27ae60' : '#e74c3c';
}

// Debt Management Functions
function borrowCredit() {
    const amount = parseFloat(document.getElementById('credit-borrow').value);

    if (!amount || amount <= 0) {
        logMessage("Please enter a valid amount to borrow", "error");
        return;
    }

    gameState.debt.creditCard.balance += amount;
    gameState.cash += amount;
    document.getElementById('credit-borrow').value = '';

    updateAllDisplays();
    logMessage(`Borrowed $${formatNumber(amount)} on credit card at 18% APR`);
}

function payCredit() {
    const amount = parseFloat(document.getElementById('credit-pay').value);

    if (!amount || amount <= 0) {
        logMessage("Please enter a valid payment amount", "error");
        return;
    }

    if (amount > gameState.cash) {
        logMessage("Insufficient cash for payment", "error");
        return;
    }

    const actualPayment = Math.min(amount, gameState.debt.creditCard.balance);
    gameState.debt.creditCard.balance -= actualPayment;
    gameState.cash -= actualPayment;
    document.getElementById('credit-pay').value = '';

    updateAllDisplays();
    logMessage(`Paid $${formatNumber(actualPayment)} toward credit card`);
}

function borrowLoan() {
    const amount = parseFloat(document.getElementById('loan-borrow').value);

    if (!amount || amount <= 0) {
        logMessage("Please enter a valid amount to borrow", "error");
        return;
    }

    gameState.debt.loan.balance += amount;
    gameState.cash += amount;
    document.getElementById('loan-borrow').value = '';

    updateAllDisplays();
    logMessage(`Borrowed $${formatNumber(amount)} as personal loan at 8% APR`);
}

function payLoan() {
    const amount = parseFloat(document.getElementById('loan-pay').value);

    if (!amount || amount <= 0) {
        logMessage("Please enter a valid payment amount", "error");
        return;
    }

    if (amount > gameState.cash) {
        logMessage("Insufficient cash for payment", "error");
        return;
    }

    const actualPayment = Math.min(amount, gameState.debt.loan.balance);
    gameState.debt.loan.balance -= actualPayment;
    gameState.cash -= actualPayment;
    document.getElementById('loan-pay').value = '';

    updateAllDisplays();
    logMessage(`Paid $${formatNumber(actualPayment)} toward personal loan`);
}

function calculateDebtInterest() {
    // Calculate monthly interest on debts
    const creditInterest = gameState.debt.creditCard.balance * (gameState.debt.creditCard.interestRate / 12);
    const loanInterest = gameState.debt.loan.balance * (gameState.debt.loan.interestRate / 12);

    gameState.debt.creditCard.balance += creditInterest;
    gameState.debt.loan.balance += loanInterest;

    return creditInterest + loanInterest;
}

function updateDebtDisplay() {
    const totalDebt = gameState.debt.creditCard.balance + gameState.debt.loan.balance;
    const creditMinPayment = Math.min(25, gameState.debt.creditCard.balance * 0.02);
    const loanPayment = gameState.debt.loan.balance > 0 ? gameState.debt.loan.balance * 0.05 : 0;

    document.getElementById('total-debt').textContent = `$${formatNumber(totalDebt)}`;
    document.getElementById('credit-balance').textContent = formatNumber(gameState.debt.creditCard.balance);
    document.getElementById('credit-min-payment').textContent = formatNumber(creditMinPayment);
    document.getElementById('loan-balance').textContent = formatNumber(gameState.debt.loan.balance);
    document.getElementById('loan-payment').textContent = formatNumber(loanPayment);
}

// Goals Tracking
function updateGoalsDisplay() {
    // Goal 1: Emergency Fund - Save $5,000
    const goal1Progress = Math.min(100, (gameState.savings.balance / 5000) * 100);
    document.getElementById('goal1-progress').style.width = `${goal1Progress}%`;
    document.getElementById('goal1-status').textContent =
        `Progress: $${formatNumber(gameState.savings.balance)} / $5,000 (${goal1Progress.toFixed(0)}%)`;

    if (goal1Progress >= 100) {
        document.getElementById('goal1').classList.add('completed');
        document.getElementById('goal1-status').textContent = 'Completed! ✓';
    }

    // Goal 2: Investment Starter - Portfolio worth $3,000
    const portfolioValue = Object.values(gameState.stocks).reduce((sum, stock) =>
        sum + (stock.shares * stock.price), 0);
    const goal2Progress = Math.min(100, (portfolioValue / 3000) * 100);
    document.getElementById('goal2-progress').style.width = `${goal2Progress}%`;
    document.getElementById('goal2-status').textContent =
        `Progress: $${formatNumber(portfolioValue)} / $3,000 (${goal2Progress.toFixed(0)}%)`;

    if (goal2Progress >= 100) {
        document.getElementById('goal2').classList.add('completed');
        document.getElementById('goal2-status').textContent = 'Completed! ✓';
    }

    // Goal 3: Debt Free - Pay off all debt
    const totalDebt = gameState.debt.creditCard.balance + gameState.debt.loan.balance;
    const goal3Complete = totalDebt === 0;
    document.getElementById('goal3-progress').style.width = goal3Complete ? '100%' : '0%';
    document.getElementById('goal3-status').textContent = goal3Complete ?
        'Status: No Debt! ✓' : `Status: $${formatNumber(totalDebt)} in debt`;

    if (goal3Complete) {
        document.getElementById('goal3').classList.add('completed');
    } else {
        document.getElementById('goal3').classList.remove('completed');
    }

    // Goal 4: Wealth Builder - Net worth $20,000
    const netWorth = calculateNetWorth();
    const goal4Progress = Math.min(100, (netWorth / 20000) * 100);
    document.getElementById('goal4-progress').style.width = `${goal4Progress}%`;
    document.getElementById('goal4-status').textContent =
        `Progress: $${formatNumber(netWorth)} / $20,000 (${goal4Progress.toFixed(0)}%)`;

    if (goal4Progress >= 100) {
        document.getElementById('goal4').classList.add('completed');
        document.getElementById('goal4-status').textContent = 'Completed! ✓';
    }
}

// Time Progression
function nextMonth() {
    gameState.month++;

    // Process monthly income and expenses
    const totalExpenses = Object.values(gameState.expenses).reduce((sum, val) => sum + val, 0);
    const netIncome = gameState.monthlyIncome - totalExpenses;
    gameState.cash += netIncome;

    // Calculate and apply savings interest
    const savingsInterest = calculateMonthlyInterest();

    // Calculate and apply debt interest
    const debtInterest = calculateDebtInterest();

    // Update stock prices
    updateStockPrices();

    // Pay dividends on stock 2 (Stable Dividends Co.)
    const dividends = gameState.stocks.stock2.shares * 0.5; // $0.50 per share
    if (dividends > 0) {
        gameState.cash += dividends;
        logMessage(`Received $${formatNumber(dividends)} in dividends from Stable Dividends Co.`);
    }

    // Log monthly summary
    logMessage(`--- Month ${gameState.month} Summary ---`, "info");
    logMessage(`Income: $${formatNumber(gameState.monthlyIncome)}, Expenses: $${formatNumber(totalExpenses)}, Net: $${formatNumber(netIncome)}`);

    if (savingsInterest > 0) {
        logMessage(`Savings interest earned: $${formatNumber(savingsInterest)}`);
        document.getElementById('monthly-interest').textContent = `$${formatNumber(savingsInterest)}`;
    }

    if (debtInterest > 0) {
        logMessage(`Debt interest charged: $${formatNumber(debtInterest)}`, "warning");
        document.getElementById('monthly-debt-interest').textContent = `$${formatNumber(debtInterest)}`;
    }

    // Random events (10% chance each month)
    if (Math.random() < 0.1) {
        triggerRandomEvent();
    }

    // Check for negative cash (bankruptcy warning)
    if (gameState.cash < 0) {
        logMessage("⚠️ WARNING: You have negative cash! Reduce expenses or increase income.", "error");
    }

    updateAllDisplays();
    saveGame();
}

function triggerRandomEvent() {
    const events = [
        {
            message: "🎉 Bonus at work! Received $500",
            effect: () => gameState.cash += 500
        },
        {
            message: "🚗 Car repair needed: -$300",
            effect: () => gameState.cash -= 300
        },
        {
            message: "🎁 Tax refund received: $400",
            effect: () => gameState.cash += 400
        },
        {
            message: "📱 Phone broke, new one needed: -$200",
            effect: () => gameState.cash -= 200
        },
        {
            message: "💼 Freelance gig completed: +$600",
            effect: () => gameState.cash += 600
        },
        {
            message: "🏥 Medical bill: -$250",
            effect: () => gameState.cash -= 250
        }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    event.effect();
    logMessage(event.message, "event");
}

// Calculate Net Worth
function calculateNetWorth() {
    const portfolioValue = Object.values(gameState.stocks).reduce((sum, stock) =>
        sum + (stock.shares * stock.price), 0);
    const totalDebt = gameState.debt.creditCard.balance + gameState.debt.loan.balance;

    return gameState.cash + gameState.savings.balance + portfolioValue - totalDebt;
}

// Update All Displays
function updateAllDisplays() {
    document.getElementById('current-month').textContent = gameState.month;
    document.getElementById('cash-balance').textContent = `$${formatNumber(gameState.cash)}`;
    document.getElementById('net-worth').textContent = `$${formatNumber(calculateNetWorth())}`;

    updateBudgetDisplay();
    updateSavingsDisplay();
    updateStockDisplay();
    updateDebtDisplay();
    updateGoalsDisplay();
}

// Event Log
function logMessage(message, type = "info") {
    const logDiv = document.getElementById('log-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `log-message log-${type}`;
    messageDiv.textContent = `[Month ${gameState.month}] ${message}`;

    logDiv.insertBefore(messageDiv, logDiv.firstChild);

    // Keep only last 20 messages
    while (logDiv.children.length > 20) {
        logDiv.removeChild(logDiv.lastChild);
    }
}

// Save/Load Game
function saveGame() {
    localStorage.setItem('financialGameSave', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('financialGameSave');
    if (saved) {
        gameState = JSON.parse(saved);

        // Restore expense input values
        Object.keys(gameState.expenses).forEach(category => {
            const input = document.querySelector(`[data-category="${category}"]`);
            if (input) input.value = gameState.expenses[category];
        });

        document.getElementById('income-input').value = gameState.monthlyIncome;
    }
}

function resetGame() {
    if (confirm("Are you sure you want to reset the game? All progress will be lost.")) {
        localStorage.removeItem('financialGameSave');
        location.reload();
    }
}

// Help Modal
function showHelp() {
    document.getElementById('help-modal').style.display = 'block';
}

function closeHelp() {
    document.getElementById('help-modal').style.display = 'none';
}

// Click outside modal to close
window.onclick = function(event) {
    const modal = document.getElementById('help-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Utility Functions
function formatNumber(num, decimals = 0) {
    return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
