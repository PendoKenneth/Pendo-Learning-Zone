const users = [
  { username: 'admin', password: 'admin123', role: 'admin', accountId: 'A001', accountName: 'Global Corp', firstName: 'Alice', lastName: 'Admin' },
  { username: 'user1', password: 'user123', role: 'user', accountId: 'U001', accountName: 'Local Ltd', firstName: 'Bob', lastName: 'User' }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let lastVisited = localStorage.getItem('lastVisitedPage') || 'dashboard1';

window.onload = () => {
  if (currentUser) {
    postLoginSetup(lastVisited);
  }
};

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    postLoginSetup();
  } else {
    alert('Invalid login');
  }
});

function postLoginSetup(page = 'dashboard1') {
  document.getElementById('login').classList.add('hidden');
  document.getElementById('nav').classList.remove('hidden');
  if (currentUser.role === 'admin') document.getElementById('admin').classList.remove('hidden');
  navigate(page);
  renderProfile();
}

function navigate(sectionId) {
  localStorage.setItem('lastVisitedPage', sectionId);
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const page = document.getElementById(sectionId);
  if (page) page.classList.remove('hidden');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('lastVisitedPage');
  document.getElementById('nav').classList.add('hidden');
  document.getElementById('admin').classList.add('hidden');
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('login').classList.remove('hidden');
}

function renderProfile() {
  if (!currentUser) return;
  const profile = `
    <p>Account ID: ${currentUser.accountId}</p>
    <p>Account Name: ${currentUser.accountName}</p>
    <p>Name: ${currentUser.firstName} ${currentUser.lastName}</p>
    <p>Role: ${currentUser.role}</p>
  `;
  document.getElementById('userProfile').innerHTML = profile;
}

function saveAccessConfig() {
  alert('Access configuration saved. (Mock implementation)');
}
