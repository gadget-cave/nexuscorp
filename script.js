// script.js

// Global variables
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
let paymentRecords = JSON.parse(localStorage.getItem('paymentRecords')) || [];

// Tab Switching
function switchTab(tabName) {
    document.getElementById('login-form').style.display = tabName === 'login' ? 'flex' : 'none';
    document.getElementById('register-form').style.display = tabName === 'register' ? 'flex' : 'none';

    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.auth-tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
}

// Register
function handleRegister(event) {
    event.preventDefault();
    const mobile = document.getElementById('mobile-number').value;
    const password = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (!/^[6-9]\d{9}$/.test(mobile)) return alert('Invalid mobile number');
    if (password.length < 6) return alert('Password must be at least 6 characters');
    if (password !== confirmPass) return alert('Passwords do not match');
    if (registeredUsers[mobile]) return alert('Already registered');

    registeredUsers[mobile] = password;
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    alert('Registration successful!');

    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.plans-section').style.display = 'block';
    document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
}

// Login
function handleLogin(event) {
    event.preventDefault();
    const mobile = document.getElementById('login-mobile').value;
    const password = document.getElementById('login-password').value;

    if (!registeredUsers[mobile]) return alert('Not registered');
    if (registeredUsers[mobile] !== password) return alert('Incorrect password');

    localStorage.setItem('currentUser', mobile);
    document.querySelector('.hero').style.display = 'none';

    if (mobile === '9744340057') {
        document.querySelector('.admin-section').style.display = 'block';
        loadPaymentRecords();
    } else {
        document.querySelector('.plans-section').style.display = 'block';
    }
    document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
}

// Select Plan
function selectPlan(amount) {
    document.querySelector('.plans-section').style.display = 'none';
    document.querySelector('.payment-section').style.display = 'block';

    let planName = amount === 500 ? 'Starter Plan' : amount === 1000 ? 'Silver Plan' : amount === 2000 ? 'Gold Plan' : 'Platinum Plan';

    document.getElementById('selected-plan-info').innerHTML = `
        <div class="selected-plan">
            <h3>Selected Plan: ${planName}</h3>
            <p>Amount: ₹${amount}</p>
            <p>Daily Return: ₹${amount / 20}</p>
            <input type="text" id="upi-id" placeholder="Enter your UPI ID" required />
            <input type="text" id="utr-id" placeholder="Enter UTR/Transaction ID" required />
            <button class="cta-button confirm-payment">I have made the payment</button>
        </div>
    `;

    document.querySelector('.payment-section').scrollIntoView({ behavior: 'smooth' });

    document.querySelector('.confirm-payment').addEventListener('click', () => confirmPayment(amount));
}

// Confirm Payment
function confirmPayment(amount) {
    const mobile = localStorage.getItem('currentUser');
    const upiId = document.getElementById('upi-id').value.trim();
    const utrId = document.getElementById('utr-id').value.trim();

    if (!upiId || !utrId) return alert('Please fill in UPI ID and UTR');

    const record = {
        mobile,
        upiId,
        utr: utrId,
        amount,
        status: 'Completed',
        date: new Date().toLocaleString()
    };

    paymentRecords.push(record);
    localStorage.setItem('paymentRecords', JSON.stringify(paymentRecords));

    alert('Payment details submitted successfully!');

    if (mobile === '9744340057') {
        loadPaymentRecords();
    }
}

// Load Admin Payment Records
function loadPaymentRecords() {
    const tbody = document.getElementById('payment-records-body');
    tbody.innerHTML = '';

    paymentRecords.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.mobile}</td>
            <td>${record.upiId}</td>
            <td>${record.utr}</td>
            <td>₹${record.amount}</td>
            <td>${record.status}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Payment Option Toggle
document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function () {
        document.querySelector('.payment-option.active')?.classList.remove('active');
        this.classList.add('active');
    });
});

