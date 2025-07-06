// Switch between login and register tabs
function switchTab(tabName) {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabs = document.querySelectorAll('.auth-tab');

  if (tabName === 'login') {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
  }
}

// Handle user registration (demo only)
function handleRegister(event) {
  event.preventDefault();
  document.querySelector('.hero').style.display = 'none';
  document.querySelector('.plans-section').style.display = 'block';
  document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
  return false;
}

// Handle plan selection
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

// Handle payment method toggle
document.addEventListener('DOMContentLoaded', () => {
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.addEventListener('click', function () {
      document.querySelector('.payment-option.active')?.classList.remove('active');
      this.classList.add('active');
    });
  });

  // Handle confirm payment
  document.querySelector('.confirm-payment').addEventListener('click', function () {
    alert('Payment received! Your plan will be activated shortly.');
  });

  // Optional smooth scroll for anchor links (if any)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});
