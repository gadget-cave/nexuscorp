// scripts.js

// Registered users (mobile: password)
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
let paymentRecords = JSON.parse(localStorage.getItem("paymentRecords")) || [];

let currentUser = localStorage.getItem("currentUser") || null;

// Handle OTP verification (simple simulation)
let pendingOTP = null;

function switchTab(tabName) {
  document.getElementById("login-form").style.display = tabName === "login" ? "flex" : "none";
  document.getElementById("register-form").style.display = tabName === "register" ? "flex" : "none";
  document.getElementById("otp-form").style.display = "none";
  document.querySelectorAll(".auth-tab").forEach((tab) => tab.classList.remove("active"));
  document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add("active");
}

function handleRegister(event) {
  event.preventDefault();
  const mobile = document.getElementById("mobile-number").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!/^\d{10}$/.test(mobile)) return alert("Invalid mobile number");
  if (password.length < 6) return alert("Password must be at least 6 characters");
  if (password !== confirmPassword) return alert("Passwords do not match");
  if (registeredUsers[mobile]) return alert("Mobile already registered");

  // Simulate OTP sending
  pendingOTP = Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem("pendingRegistration", JSON.stringify({ mobile, password }));

  document.getElementById("register-form").style.display = "none";
  document.getElementById("otp-form").style.display = "flex";
  alert(`Your OTP is ${pendingOTP} (for demo only)`);
}

function verifyOTP(event) {
  event.preventDefault();
  const entered = document.getElementById("otp-code").value;
  const pending = JSON.parse(localStorage.getItem("pendingRegistration"));

  if (!pending || parseInt(entered) !== pendingOTP) return alert("Invalid OTP");

  registeredUsers[pending.mobile] = pending.password;
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  localStorage.setItem("currentUser", pending.mobile);

  alert("Registration successful! Logged in.");
  document.getElementById("otp-form").style.display = "none";
  showPlans(pending.mobile);
}

function handleLogin(event) {
  event.preventDefault();
  const mobile = document.getElementById("login-mobile").value;
  const password = document.getElementById("login-password").value;

  if (!registeredUsers[mobile]) return alert("User not found");
  if (registeredUsers[mobile] !== password) return alert("Incorrect password");

  localStorage.setItem("currentUser", mobile);
  showPlans(mobile);
}

function showPlans(mobile) {
  document.querySelector(".hero").style.display = "none";
  if (mobile === "9744340057") {
    document.querySelector(".admin-section").style.display = "block";
    loadPaymentRecords();
  } else {
    document.querySelector(".plans-section").style.display = "block";
  }
}

function selectPlan(amount) {
  const daily = amount / 20;
  document.querySelector(".plans-section").style.display = "none";
  document.querySelector(".payment-section").style.display = "block";
  document.getElementById("selected-plan-info").innerHTML = `
    <div class="selected-plan">
      <h3>Selected Plan</h3>
      <p>Amount: ₹${amount}</p>
      <p>Daily Return: ₹${daily}</p>
    </div>
  `;
}

document.querySelector(".confirm-payment").addEventListener("click", () => {
  const mobile = localStorage.getItem("currentUser");
  const amount = parseInt(document.querySelector(".selected-plan p:nth-child(2)").textContent.split("₹")[1]);
  const upiId = prompt("Enter your UPI ID:");
  const utr = prompt("Enter your UTR number:");

  const record = {
    mobile,
    upiId,
    utr,
    amount,
    status: "Pending",
  };

  paymentRecords.push(record);
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  alert("Payment submitted! Waiting for admin approval.");

  document.querySelector(".payment-section").style.display = "none";
});

function loadPaymentRecords() {
  const tbody = document.getElementById("payment-records-body");
  tbody.innerHTML = "";

  paymentRecords.forEach((r, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.mobile}</td>
      <td>${r.upiId}</td>
      <td>${r.utr}</td>
      <td>₹${r.amount}</td>
      <td>${r.status}</td>
      <td><button onclick="acceptPlan(${index})">Accept</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function acceptPlan(index) {
  paymentRecords[index].status = "Accepted";
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  alert("Plan activated and marked as accepted.");
  loadPaymentRecords();
}
