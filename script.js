// NexusCorp script.js

// Load registered users and payment records from localStorage
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
let paymentRecords = JSON.parse(localStorage.getItem("paymentRecords")) || [];

// Switch tabs between Login and Register
function switchTab(tabName) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabs = document.querySelectorAll(".auth-tab");

  if (tabName === "login") {
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "flex";
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
  }
}

// Register user
function handleRegister(event) {
  event.preventDefault();
  const mobile = document.getElementById("mobile-number").value;
  const password = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (!/^[6-9]\d{9}$/.test(mobile)) return alert("Invalid mobile number");
  if (password.length < 6) return alert("Password too short");
  if (password !== confirmPass) return alert("Passwords do not match");
  if (registeredUsers[mobile]) return alert("Mobile already registered");

  registeredUsers[mobile] = password;
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  alert("Registration successful! Login now.");
  switchTab("login");
}

// Login user
function handleLogin(event) {
  event.preventDefault();
  const mobile = document.getElementById("login-mobile").value;
  const password = document.getElementById("login-password").value;

  if (!registeredUsers[mobile]) return alert("Not registered");
  if (registeredUsers[mobile] !== password) return alert("Incorrect password");

  localStorage.setItem("currentUser", mobile);
  document.querySelector(".hero").style.display = "none";

  if (mobile === "9744340057") {
    document.querySelector(".admin-section").style.display = "block";
    loadPaymentRecords();
  } else {
    document.querySelector(".plans-section").style.display = "block";
  }
}

// Plan selection
function selectPlan(amount) {
  const plans = {
    500: "Starter Plan",
    1000: "Silver Plan",
    2000: "Gold Plan",
    5000: "Platinum Plan"
  };
  const planName = plans[amount];
  const daily = amount / 20;
  document.querySelector(".plans-section").style.display = "none";
  document.querySelector(".payment-section").style.display = "block";
  document.getElementById("selected-plan-info").innerHTML = `
    <div class="selected-plan">
      <h3>${planName}</h3>
      <p>Amount: ₹${amount}</p>
      <p>Daily Return: ₹${daily}</p>
      <div class="form-group">
        <input id="upi-id" placeholder="Enter your UPI ID" required />
      </div>
      <div class="form-group">
        <input id="utr-id" placeholder="Enter UTR/Transaction ID" required />
      </div>
      <button class="cta-button" onclick="confirmPayment(${amount})">Submit</button>
    </div>
  `;
}

// Confirm payment
function confirmPayment(amount) {
  const mobile = localStorage.getItem("currentUser");
  const upiId = document.getElementById("upi-id").value;
  const utr = document.getElementById("utr-id").value;
  const record = {
    mobile,
    upiId,
    utr,
    amount,
    status: "Pending",
    accepted: false
  };
  paymentRecords.push(record);
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  alert("Payment info submitted! Please wait for admin approval.");
  document.querySelector(".payment-section").innerHTML = "<h3>Thank you! Your submission has been received.</h3>";
}

// Admin view
function loadPaymentRecords() {
  const tbody = document.getElementById("payment-records-body");
  tbody.innerHTML = "";
  paymentRecords.forEach((record, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${record.mobile}</td>
      <td>${record.upiId}</td>
      <td>${record.utr}</td>
      <td>₹${record.amount}</td>
      <td>${record.status}</td>
      <td><button onclick="acceptRecord(${index})">Accept</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function acceptRecord(index) {
  paymentRecords[index].status = "Accepted";
  paymentRecords[index].accepted = true;
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  loadPaymentRecords();
  alert("Payment accepted.");
}

// On load, check if already logged in
window.onload = () => {
  const mobile = localStorage.getItem("currentUser");
  if (mobile) {
    document.querySelector(".hero").style.display = "none";
    if (mobile === "9744340057") {
      document.querySelector(".admin-section").style.display = "block";
      loadPaymentRecords();
    } else {
      document.querySelector(".plans-section").style.display = "block";
    }
  }
};

