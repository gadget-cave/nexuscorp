// script.js

let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
let paymentRecords = JSON.parse(localStorage.getItem("paymentRecords")) || [];

function switchTab(tabName) {
  document.getElementById("login-form").style.display = tabName === 'login' ? 'block' : 'none';
  document.getElementById("register-form").style.display = tabName === 'register' ? 'block' : 'none';
  document.querySelectorAll(".auth-tab").forEach((tab, i) => {
    tab.classList.toggle("active", (tabName === 'login' && i === 0) || (tabName === 'register' && i === 1));
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

let currentOTP = null;

function sendOTP(mobile) {
  currentOTP = generateOTP();
  alert(`Your OTP for registration is: ${currentOTP}`); // Simulated OTP
}

function handleRegister(event) {
  event.preventDefault();
  const mobile = document.getElementById("reg-mobile").value;
  const pass = document.getElementById("reg-pass").value;
  const confirm = document.getElementById("reg-confirm").value;
  const otp = document.getElementById("reg-otp").value;

  if (!/^[6-9]\d{9}$/.test(mobile)) return alert("Invalid Indian mobile number");
  if (pass !== confirm) return alert("Passwords do not match");
  if (otp != currentOTP) return alert("Invalid OTP");

  if (registeredUsers[mobile]) return alert("Already registered");
  registeredUsers[mobile] = pass;
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  localStorage.setItem("currentUser", mobile);
  alert("Registration successful!");
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".plans-section").style.display = "block";
}

function handleLogin(event) {
  event.preventDefault();
  const mobile = document.getElementById("login-mobile").value;
  const pass = document.getElementById("login-password").value;
  if (registeredUsers[mobile] !== pass) return alert("Invalid credentials");
  localStorage.setItem("currentUser", mobile);
  document.querySelector(".hero").style.display = "none";
  if (mobile === "9744340057") {
    loadAdmin();
  } else {
    document.querySelector(".plans-section").style.display = "block";
  }
}

function selectPlan(amount, name) {
  document.querySelector(".plans-section").style.display = "none";
  document.querySelector(".payment-section").style.display = "block";
  document.getElementById("selected-plan-name").innerText = name;
  document.getElementById("selected-plan-amount").innerText = amount;
}

function showUTRForm() {
  document.querySelector(".payment-section").style.display = "none";
  document.querySelector(".utr-section").style.display = "block";
}

function submitUTR() {
  const upi = document.getElementById("user-upi").value;
  const utr = document.getElementById("user-utr").value;
  const amount = document.getElementById("selected-plan-amount").innerText;
  const mobile = localStorage.getItem("currentUser");

  const rec = { mobile, upiId: upi, utr, amount, status: "Pending", planAccepted: false };
  paymentRecords.push(rec);
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  alert("Payment submitted. Waiting for admin approval.");
  document.querySelector(".utr-section").style.display = "none";
}

function loadAdmin() {
  document.querySelector(".admin-section").style.display = "block";
  const tbody = document.getElementById("admin-table-body");
  tbody.innerHTML = "";
  paymentRecords.forEach((rec, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${rec.mobile}</td>
      <td>${rec.upiId}</td>
      <td>${rec.utr}</td>
      <td>₹${rec.amount}</td>
      <td>${rec.status}</td>
      <td><button class="accept-btn" onclick="acceptPlan(${index})">Accept</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function acceptPlan(index) {
  paymentRecords[index].status = "Accepted";
  paymentRecords[index].planAccepted = true;
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  loadAdmin();
  alert("Plan accepted and activated!");
}

function isPlanAccepted(mobile) {
  return paymentRecords.some(
    (r) => r.mobile === mobile && r.planAccepted === true
  );
}


