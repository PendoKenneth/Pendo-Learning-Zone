// Fixed main.js - Pendo Learning Zone

const users = [
  { username: 'admin', password: 'admin123', role: 'admin', accountId: 'A001', accountName: 'Global Corp', firstName: 'Alice', lastName: 'Admin' },
  { username: 'user1', password: 'user123', role: 'user', accountId: 'U001', accountName: 'Local Ltd', firstName: 'Bob', lastName: 'User' }
];

let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let lastVisited = localStorage.getItem('lastVisitedPage') || 'dashboard1';

window.onload = () => {
  if (currentUser) {
    postLoginSetup(lastVisited);
  } else {
    // Show login page by default
    document.getElementById('login').classList.remove('hidden');
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
    alert('Invalid login credentials. Please try again.');
  }
});

function postLoginSetup(page = 'dashboard1') {
  injectPendo(currentUser || {
    username: null,
    role: null,
    firstName: null,
    lastName: null,
    accountId: null,
    accountName: null
  });

  // Hide login page
  document.getElementById('login').classList.add('hidden');
  
  // Show navigation
  document.getElementById('nav').classList.remove('hidden');
  
  // Show admin panel if admin user
  if (currentUser && currentUser.role === 'admin') {
    document.getElementById('admin')?.classList.remove('hidden');
  }
  
  // Navigate to dashboard
  navigate(page);
  renderProfile();
}

function navigate(sectionId) {
  localStorage.setItem('lastVisitedPage', sectionId);
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  
  // Show selected page
  const page = document.getElementById(sectionId);
  if (page) {
    page.classList.remove('hidden');
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('lastVisitedPage');
  
  // Hide navigation and admin
  document.getElementById('nav').classList.add('hidden');
  document.getElementById('admin')?.classList.add('hidden');
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  
  // Show login page
  document.getElementById('login').classList.remove('hidden');
  
  // Clear form
  document.getElementById('loginForm').reset();
}

function renderProfile() {
  if (!currentUser) return;
  
  const profile = `
    <div class="card">
      <h3>User Information</h3>
      <p><strong>Account ID:</strong> ${currentUser.accountId}</p>
      <p><strong>Account Name:</strong> ${currentUser.accountName}</p>
      <p><strong>Name:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
      <p><strong>Role:</strong> ${currentUser.role}</p>
    </div>
  `;
  document.getElementById('userProfile').innerHTML = profile;
}

function saveAccessConfig() {
  alert('Access configuration saved successfully! (Mock implementation)');
}

function injectPendo(user) {
  (function(apiKey){
    (function(p,e,n,d,o){
      var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
      v=['initialize','identify','updateOptions','pageLoad','track'];
      for(w=0,x=v.length;w<x;++w)(function(m){
        o[m]=o[m]||function(){
          o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));
        };
      })(v[w]);
      y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/92229851-01d2-455a-46ae-0e2efbb02051/pendo.js';
      z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);
    })(window,document,'script','pendo');

    pendo.initialize({
      visitor: {
        id: user.username,
        role: user.role,
        full_name: user.firstName + ' ' + user.lastName
      },
      account: {
        id: user.accountId,
        name: user.accountName
      }
    });
  })('92229851-01d2-455a-46ae-0e2efbb02051');
}

// Product filter functionality
document.addEventListener('DOMContentLoaded', function() {
  const productFilterForm = document.getElementById('productFilterForm');
  if (productFilterForm) {
    productFilterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const category = document.getElementById('categoryFilter').value;
      const sortBy = document.getElementById('sortBy').value;
      const keyword = document.getElementById('searchInput').value.trim().toLowerCase();

      const rows = Array.from(document.querySelectorAll('#productTable tbody tr'));

      const filtered = rows.filter(row => {
        const cat = row.children[2].textContent.trim();
        const matchesCategory = !category || cat === category;
        const matchesKeyword = !keyword || row.textContent.toLowerCase().includes(keyword);
        return matchesCategory && matchesKeyword;
      });

      const getValue = (cell, key) => {
        const text = cell.textContent.trim();
        if (key === 'price') return parseFloat(text.replace('$', ''));
        if (key === 'stock') return parseInt(text);
        return text.toLowerCase();
      };

      filtered.sort((a, b) => {
        const colIndex = sortBy === 'name' ? 1 : sortBy === 'price' ? 3 : 4;
        const valA = getValue(a.children[colIndex], sortBy);
        const valB = getValue(b.children[colIndex], sortBy);
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      });

      const highlightMatch = (html, keyword) => {
        if (!keyword) return html;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return html.replace(regex, '<mark>$1</mark>');
      };

      const tbody = document.querySelector('#productTable tbody');
      tbody.innerHTML = '';
      filtered.forEach(row => {
        const newRow = row.cloneNode(true);
        if (keyword) {
          Array.from(newRow.children).forEach(cell => {
            if (cell.cellIndex < 5) { // Don't highlight the action button
              cell.innerHTML = highlightMatch(cell.innerHTML, keyword);
            }
          });
        }
        tbody.appendChild(newRow);
      });
    });
  }
});

// Add interactive functionality
document.addEventListener('click', function(e) {
  if (e.target.id === 'analytics-refresh') {
    alert('Charts refreshed! (Mock functionality)');
  }
  
  if (e.target.id === 'download-link') {
    e.preventDefault();
    alert('Report download started! (Mock functionality)');
  }
  
  if (e.target.id === 'report-email') {
    alert('Report emailed! (Mock functionality)');
  }
  
  if (e.target.id === 'report-export') {
    alert('Report exported to CSV! (Mock functionality)');
  }
  
  // Product add buttons
  if (e.target.textContent === 'Add' && e.target.tagName === 'BUTTON') {
    const row = e.target.closest('tr');
    const productName = row.children[1].textContent;
    alert(`${productName} added to cart! (Mock functionality)`);
  }
});

// Form submissions
document.addEventListener('submit', function(e) {
  if (e.target.getAttribute('aria-label') === 'Settings Form') {
    e.preventDefault();
    alert('Settings saved successfully! (Mock functionality)');
  }
  
  if (e.target.getAttribute('aria-label') === 'Profile Preferences') {
    e.preventDefault();
    alert('Profile updated successfully! (Mock functionality)');
  }
  
  if (e.target.getAttribute('aria-label') === 'Data Range Filter') {
    e.preventDefault();
    alert('Data filtered successfully! (Mock functionality)');
  }
  
  if (e.target.getAttribute('aria-label') === 'Custom Report Generator') {
    e.preventDefault();
    alert('Custom report generated successfully! (Mock functionality)');
  }
});
