// Save registered users and OTPs
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {};
let otpStore = {}; // { mobile: otp }
let paymentRecords = JSON.parse(localStorage.getItem("paymentRecords")) || [];

// Switch between Login and Register
function switchTab(tab) {
  document.getElementById("login-form").style.display =
    tab === "login" ? "flex" : "none";
  document.getElementById("register-form").style.display =
    tab === "register" ? "flex" : "none";
  document.querySelectorAll(".auth-tab").forEach((btn) =>
    btn.classList.remove("active")
  );
  document.querySelector(
    `.auth-tab[onclick*='${tab}']`
  ).classList.add("active");
}

function sendOTP() {
  const mobile = document.getElementById("register-mobile").value;
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    alert("Enter valid 10-digit Indian mobile number");
    return;
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[mobile] = otp;
  alert("OTP Sent: " + otp); // Simulate sending OTP
  document.getElementById("otp-container").style.display = "block";
}

function handleRegister(event) {
  event.preventDefault();
  const mobile = document.getElementById("register-mobile").value;
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-confirm").value;
  const otpInput = document.getElementById("register-otp").value;

  if (password !== confirm) return alert("Passwords do not match");
  if (!otpStore[mobile] || otpStore[mobile] != otpInput)
    return alert("Incorrect OTP");
  if (registeredUsers[mobile]) return alert("Mobile already registered");

  registeredUsers[mobile] = password;
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  localStorage.setItem("currentUser", mobile);

  showPlans();
}

function handleLogin(event) {
  event.preventDefault();
  const mobile = document.getElementById("login-mobile").value;
  const password = document.getElementById("login-password").value;
  const stored = registeredUsers[mobile];

  if (!stored) return alert("Not registered");
  if (stored !== password) return alert("Wrong password");

  localStorage.setItem("currentUser", mobile);

  if (mobile === "9744340057") {
    showAdminPanel();
  } else {
    showPlans();
  }
}

function showPlans() {
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".plans-section").style.display = "block";
  document.querySelector(".plans-section").scrollIntoView({ behavior: "smooth" });
}

function showAdminPanel() {
  document.querySelector(".hero").style.display = "none";
  document.querySelector(".admin-section").style.display = "block";
  loadPaymentRecords();
  document.querySelector(".admin-section").scrollIntoView({ behavior: "smooth" });
}

function selectPlan(amount, planName) {
  document.querySelector(".plans-section").style.display = "none";
  document.querySelector(".payment-section").style.display = "block";
  document.getElementById("selected-plan-info").innerHTML = `
    <div class="selected-plan">
      <h3>${planName}</h3>
      <p>Amount: ₹${amount}</p>
      <p>Daily Return: ₹${amount / 20}</p>
    </div>
  `;
  document.getElementById("plan-amount").value = amount;
}

function confirmPayment() {
  const mobile = localStorage.getItem("currentUser");
  const upiId = document.getElementById("upi-id").value;
  const utrId = document.getElementById("utr-id").value;
  const amount = document.getElementById("plan-amount").value;

  if (!upiId || !utrId) return alert("Fill UPI and UTR fields");

  const record = {
    mobile,
    upiId,
    utr: utrId,
    amount,
    status: "Pending",
    plan: amount,
    color: "default",
  };
  paymentRecords.push(record);
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  alert("Payment sent for admin verification");
  location.reload();
}

function loadPaymentRecords() {
  const tbody = document.getElementById("payment-records-body");
  tbody.innerHTML = "";

  paymentRecords.forEach((rec, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${rec.mobile}</td>
      <td>${rec.upiId}</td>
      <td>${rec.utr}</td>
      <td>₹${rec.amount}</td>
      <td class="plan-status" style="color:$
        {rec.color === 'gold' ? 'goldenrod' : 'black'}">${rec.status}</td>
      <td><button onclick="accept(${index})">Accept</button></td>
    `;
    tbody.appendChild(row);
  });
}

function accept(index) {
  paymentRecords[index].status = "Accepted";
  paymentRecords[index].color = "gold";
  localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));
  loadPaymentRecords();
}

// Initialize view
window.onload = () => {
  const user = localStorage.getItem("currentUser");
  if (user === "9744340057") {
    showAdminPanel();
  } else if (user) {
    showPlans();
  }
};
