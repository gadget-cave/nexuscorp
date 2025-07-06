// script.js

let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;
let purchases = JSON.parse(localStorage.getItem('purchases')) || [];
let withdraws = JSON.parse(localStorage.getItem('withdraws')) || [];

const admin = {
  mobile: "9744340057",
  password: "Hixzam@786"
};

function saveToStorage() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('purchases', JSON.stringify(purchases));
  localStorage.setItem('withdraws', JSON.stringify(withdraws));
}

function registerUser() {
  const name = document.getElementById("regName").value;
  const mobile = document.getElementById("regMobile").value;
  const pass = document.getElementById("regPass").value;
  const confirmPass = document.getElementById("regConfirmPass").value;
  const otp = document.getElementById("regOTP").value;
  if (pass !== confirmPass || otp !== "1234") return alert("Invalid input or OTP");
  if (users.find(u => u.mobile === mobile)) return alert("User already exists");
  users.push({ name, mobile, pass, daily: 0, commission: 0, plan: null, accepted: false });
  saveToStorage();
  alert("Registered successfully");
}

function loginUser() {
  const mobile = document.getElementById("loginMobile").value;
  const pass = document.getElementById("loginPass").value;
  if (mobile === admin.mobile && pass === admin.password) return showAdmin();
  const user = users.find(u => u.mobile === mobile && u.pass === pass);
  if (!user) return alert("Login failed");
  currentUser = user;
  document.getElementById("authSection").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  loadPlans();
  updateAccount();
}

function logoutUser() {
  currentUser = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("authSection").style.display = "block";
}

function showPage(page) {
  document.getElementById("homePage").style.display = page === 'home' ? 'block' : 'none';
  document.getElementById("accountPage").style.display = page === 'account' ? 'block' : 'none';
}

function loadPlans() {
  const plans = [
    { amount: 500, daily: 50, days: 20 },
    { amount: 1000, daily: 100, days: 20 },
    { amount: 1500, daily: 150, days: 20 },
    { amount: 2000, daily: 200, days: 20 },
    { amount: 2500, daily: 250, days: 20 },
    { amount: 3000, daily: 300, days: 20 },
  ];
  const box = document.getElementById("plansContainer");
  box.innerHTML = "";
  plans.forEach(plan => {
    const div = document.createElement("div");
    div.className = "plan-box" + (currentUser.plan?.amount === plan.amount && currentUser.accepted ? " gold" : "");
    div.innerHTML = `
      <img src="https://via.placeholder.com/100" />
      <p>Plan: ₹${plan.amount}</p>
      <p>Daily Return: ₹${plan.daily}</p>
      <p>Duration: ${plan.days} Days</p>
      <p>Total: ₹${plan.daily * plan.days}</p>
      <button onclick='buyPlan(${JSON.stringify(plan)})'>Buy Now</button>
      <button onclick='referFriend()'>Refer a Friend</button>
    `;
    box.appendChild(div);
  });
}

function buyPlan(plan) {
  const upi = prompt("Enter your UPI ID");
  const utr = prompt("Enter your UTR Number after payment to xixam.hishamm@fam");
  if (!upi || !utr) return alert("UPI and UTR required");
  currentUser.plan = plan;
  currentUser.upi = upi;
  currentUser.utr = utr;
  currentUser.accepted = false;
  purchases.push({ name: currentUser.name, mobile: currentUser.mobile, amount: plan.amount, upi, utr });
  saveToStorage();
  alert("Payment submitted for admin verification");
}

function referFriend() {
  const refLink = `https://yoursite.com?ref=${currentUser.mobile}`;
  navigator.clipboard.writeText(refLink);
  alert("Referral link copied: " + refLink);
}

function updateAccount() {
  document.getElementById("dailyReturn").innerText = currentUser.daily;
  document.getElementById("commission").innerText = currentUser.commission;
}

function requestWithdraw() {
  withdraws.push({ mobile: currentUser.mobile, amount: currentUser.daily + currentUser.commission });
  saveToStorage();
  alert("Withdraw request sent to admin");
}

function showAdmin() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  const pTable = document.getElementById("purchaseTable").querySelector("tbody");
  const wTable = document.getElementById("withdrawTable").querySelector("tbody");
  pTable.innerHTML = "";
  wTable.innerHTML = "";
  purchases.forEach((p, i) => {
    const row = pTable.insertRow();
    row.innerHTML = `<td>${p.name}</td><td>${p.mobile}</td><td>${p.amount}</td><td>${p.upi}</td><td>${p.utr}</td><td><button onclick='acceptPlan(${i})'>Accept</button></td>`;
  });
  withdraws.forEach((w, i) => {
    const row = wTable.insertRow();
    row.innerHTML = `<td>${w.mobile}</td><td>${w.amount}</td><td><button onclick='approveWithdraw(${i})'>Approve</button></td>`;
  });
}

function acceptPlan(i) {
  const p = purchases[i];
  const user = users.find(u => u.mobile === p.mobile);
  if (user) {
    user.accepted = true;
    user.daily += user.plan.daily;
  }
  purchases.splice(i, 1);
  saveToStorage();
  showAdmin();
}

function approveWithdraw(i) {
  const w = withdraws[i];
  const user = users.find(u => u.mobile === w.mobile);
  if (user) {
    user.daily = 0;
    user.commission = 0;
  }
  withdraws.splice(i, 1);
  saveToStorage();
  showAdmin();
}
