function switchTab(tabName) {
  if (tabName === 'login') {
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.querySelectorAll('.auth-tab')[1].classList.remove('active');
  } else {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
    document.querySelectorAll('.auth-tab')[0].classList.remove('active');
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
  }
}

function selectPlan(amount) {
  document.querySelector('.plans-section').style.display = 'none';
  document.querySelector('.payment-section').style.display = 'block';

  let planName = '';
  let dailyReturn = amount / 20;
  if (amount === 500) planName = 'Starter Plan';
  else if (amount === 1000) planName = 'Silver Plan';
  else if (amount === 2000) planName = 'Gold Plan';
  else if (amount === 5000) planName = 'Platinum Plan';

  document.getElementById('selected-plan-info').innerHTML = `
    <div class="selected-plan">
        <h3>Selected Plan: ${planName}</h3>
        <p>Amount: ₹${amount}</p>
        <p>Daily Return: ₹${dailyReturn}</p>
    </div>
  `;

  document.querySelector('.payment-section').scrollIntoView({ behavior: 'smooth' });
}

// Payment option toggle
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.payment-option').forEach(option => {
    option.addEventListener('click', function () {
      document.querySelector('.payment-option.active').classList.remove('active');
      this.classList.add('active');
    });
  });
});

function startUPIPayment() {
  const amount = document.querySelector('.selected-plan p:nth-child(2)').textContent.split('₹')[1];
  const upiLink = `upi://pay?pa=xixam.hishamm@fam&pn=NexusCorp&am=${amount}&cu=INR`;
  window.location.href = upiLink;
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.confirm-payment').addEventListener('click', function () {
    const mobile = localStorage.getItem('currentUser');
    const amount = document.querySelector('.selected-plan p:nth-child(2)').textContent.split('₹')[1];

    if (mobile === '9744340057') {
      const record = addPaymentRecord(mobile, amount);
      const receipt = `
        <div class="payment-receipt">
            <h3>Payment Details</h3>
            <p>UPI ID: ${record.upiId}</p>
            <p>UTR Number: ${record.utr}</p>
            <p>Payment verified! Your plan is now active.</p>
        </div>
      `;
      document.getElementById('selected-plan-info').innerHTML += receipt;
    } else {
      const record = addPaymentRecord(mobile, amount);
      alert(`Payment received! UTR: ${record.utr}. Your plan will be activated shortly.`);
    }
  });
});

// Local storage user and record management
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
let paymentRecords = JSON.parse(localStorage.getItem('paymentRecords')) || [];

function addPaymentRecord(mobile, amount) {
  const record = {
    mobile,
    upiId: 'xixam.hishamm@fam',
    utr: 'NXSP' + Math.floor(100000 + Math.random() * 900000),
    amount,
    status: 'Completed',
    date: new Date().toISOString()
  };
  paymentRecords.push(record);
  localStorage.setItem('paymentRecords', JSON.stringify(paymentRecords));
  return record;
}

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

function handleLogin(event) {
  event.preventDefault();
  const mobile = document.getElementById('login-mobile').value;
  const password = document.getElementById('login-password').value;

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    alert('Please enter a valid 10-digit Indian mobile number');
    return false;
  }

  const storedUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
  if (!storedUsers[mobile]) {
    alert('Mobile number not registered. Please register first.');
    switchTab('register');
    return false;
  }

  if (storedUsers[mobile] !== password) {
    alert('Incorrect password');
    return false;
  }

  localStorage.setItem('currentUser', mobile);
  document.querySelector('.hero').style.display = 'none';

  if (mobile === '9744340057') {
    document.querySelector('.admin-section').style.display = 'block';
    loadPaymentRecords();
  } else {
    document.querySelector('.plans-section').style.display = 'block';
  }

  document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
  return false;
}

function handleRegister(event) {
  event.preventDefault();
  const mobile = document.getElementById('mobile-number').value;
  const password = document.getElementById('password').value;
  const confirmPass = document.getElementById('confirm-password').value;

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    alert('Please enter a valid 10-digit Indian mobile number');
    return false;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return false;
  }

  if (password !== confirmPass) {
    alert('Passwords do not match!');
    return false;
  }

  if (registeredUsers[mobile]) {
    alert('This mobile number is already registered');
    return false;
  }

  registeredUsers[mobile] = password;
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  alert('Registration successful! You can now login');

  document.querySelector('.hero').style.display = 'none';
  document.querySelector('.plans-section').style.display = 'block';
  document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
  return false;
}

