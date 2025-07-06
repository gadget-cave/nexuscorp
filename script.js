// script.js

let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
let currentUser = localStorage.getItem("currentUser") || null;
let paymentRequests = JSON.parse(localStorage.getItem("paymentRequests")) || [];

function switchForm(type) {
  document.getElementById("login-form").style.display =
    type === "login" ? "block" : "none";
  document.getElementById("register-form").style.display =
    type === "register" ? "block" : "none";
}

function sendOTP(mobile) {
  const otp = Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem("otp_" + mobile, otp);
  alert("Your OTP is: " + otp);
}

function handleRegister() {
  const mobile = document.getElementById("register-mobile").value;
  const password = document.getElementById("register-password").value;
  const otpInput = document.getElementById("register-otp").value;
  const realOTP = localStorage.getItem("otp_" + mobile);

  if (!/^\d{10}$/.test(mobile)) return alert("Enter valid 10-digit number");
  if (password.length < 4) return alert("Password too short");
  if (!otpInput || otpInput !== realOTP) return alert("Invalid OTP");
  if (registeredUsers[mobile]) return alert("Mobile already registered");

  registeredUsers[mobile] = { password };
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  alert("Registered! Please login.");
  switchForm("login");
}

function handleLogin() {
  const mobile = document.getElementById("login-mobile").value;
  const password = document.getElementById("login-password").value;
  const user = registeredUsers[mobile];
  if (!user || user.password !== password)
    return alert("Invalid login");

  currentUser = mobile;
  localStorage.setItem("currentUser", mobile);

  document.querySelector(".hero").style.display = "none";
  if (mobile === "9744340057") {
    document.querySelector(".admin-section").style.display = "block";
    renderAdminTable();
  } else {
    document.querySelector(".plans-section").style.display = "block";
  }
}

function selectPlan(amount, name) {
  document.querySelector(".plans-section").style.display = "none";
  document.querySelector(".payment-section").style.display = "block";
  document.getElementById("selected-plan").innerHTML = `${name} - ₹${amount}`;
  document.getElementById("selected-amount").value = amount;
}

function submitPaymentDetails() {
  const upi = document.getElementById("user-upi").value;
  const utr = document.getElementById("user-utr").value;
  const amount = document.getElementById("selected-amount").value;

  if (!upi || !utr) return alert("Enter UPI and UTR");

  const record = {
    mobile: currentUser,
    upi,
    utr,
    amount,
    status: "Pending"
  };
  paymentRequests.push(record);
  localStorage.setItem("paymentRequests", JSON.stringify(paymentRequests));
  alert("Payment submitted! Admin will review.");
  document.querySelector(".payment-section").style.display = "none";
}

function renderAdminTable() {
  const tbody = document.getElementById("admin-payment-body");
  tbody.innerHTML = "";

  paymentRequests.forEach((req, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${req.mobile}</td>
      <td>${req.upi}</td>
      <td>${req.utr}</td>
      <td>₹${req.amount}</td>
      <td>${req.status}</td>
      <td><button onclick="acceptPayment(${i})">Accept</button></td>
    `;
    tbody.appendChild(row);
  });
}

function acceptPayment(index) {
  paymentRequests[index].status = "Accepted";
  localStorage.setItem("paymentRequests", JSON.stringify(paymentRequests));
  renderAdminTable();
  highlightPlan(paymentRequests[index].mobile);
}

function highlightPlan(mobile) {
  if (currentUser === mobile) {
    const plans = document.querySelectorAll(".plan-card");
    plans.forEach(p => (p.style.border = "2px solid gold"));
  }
}

