// const VALID_EMAIL = 'admin@gmail.com';
// const VALID_PASSWORD = 'Brian';

// let mode = 'login';

// function handleSubmit(e) {
//   e.preventDefault();
//   clearMessages();

//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;
//   const name = document.getElementById('name').value.trim();

//   if (mode === 'login') {
//     if (email === VALID_EMAIL && password === VALID_PASSWORD) {
//       showSuccess('Login successful! Redirecting...');
      
//       // --- REDIRECT LOGIC ---
//       // This will trigger the move to the new site after a tiny delay 
//       // so the user actually sees the "Success" message.
//       setTimeout(() => {
//         window.location.href = "KaiXin.html"; // Replace with your URL
//       }, 1000);
      
//     } else {
//       showError('Invalid email or password. Please try again.');
//     }
//   } else {
//     if (!name || !email || !password) {
//       showError('Please fill in all fields.');
//       return;
//     }
//     showSuccess('Account created! You can now log in.');
//     setTimeout(() => switchMode(), 1500);
//   }
// }

// function switchMode() {
//   clearMessages();
//   document.getElementById('email').value = '';
//   document.getElementById('password').value = '';
//   document.getElementById('name').value = '';

//   if (mode === 'login') {
//     mode = 'signup';
//     document.getElementById('form-title').textContent = 'Create an account';
//     document.getElementById('form-subtitle').textContent = 'Sign up to get started today';
//     document.getElementById('name-group').classList.remove('hidden');
//     document.getElementById('submit-btn').textContent = 'Create Account';
//     document.getElementById('switch-text').textContent = 'Already have an account?';
//     document.getElementById('switch-btn-label').textContent = 'Sign in';
//   } else {
//     mode = 'login';
//     document.getElementById('form-title').textContent = 'Welcome back';
//     document.getElementById('form-subtitle').textContent = 'Sign in to your account to continue';
//     document.getElementById('name-group').classList.add('hidden');
//     document.getElementById('submit-btn').textContent = 'Sign In';
//     document.getElementById('switch-text').textContent = "Don't have an account?";
//     document.getElementById('switch-btn-label').textContent = 'Sign up';
//   }
// }

// function togglePassword() {
//   const input = document.getElementById('password');
//   input.type = input.type === 'password' ? 'text' : 'password';
// }

// function showError(msg) {
//   const el = document.getElementById('error-msg');
//   el.textContent = msg;
//   el.classList.remove('hidden');
// }

// function showSuccess(msg) {
//   const el = document.getElementById('success-msg');
//   el.textContent = msg;
//   el.classList.remove('hidden');
// }

// function clearMessages() {
//   const errorEl = document.getElementById('error-msg');
//   const successEl = document.getElementById('success-msg');
//   if (errorEl) errorEl.classList.add('hidden');
//   if (successEl) successEl.classList.add('hidden');
// }
// Default admin credentials for testing
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Brian';

let mode = 'login';

// Initialize users list from localStorage or an empty array
let users = JSON.parse(localStorage.getItem('medical_users')) || [];

function handleSubmit(e) {
  e.preventDefault();
  clearMessages();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value.trim();

  if (mode === 'login') {
    // 1. Check if it's the hardcoded admin
    const isAdmin = (email === ADMIN_EMAIL && password === ADMIN_PASSWORD);
    
    // 2. Check if the user exists in our "Local Database"
    const existingUser = users.find(u => u.email === email && u.password === password);

    if (isAdmin || existingUser) {
      showSuccess('Login successful! Redirecting...');
      
      // Redirect to the dashboard
      setTimeout(() => {
        window.location.href = "/KaiXin.html"; 
      }, 1000);
      
    } else {
      showError('Invalid email or password. Please try again.');
    }
  } else {
    // --- SIGN UP LOGIC ---
    if (!name || !email || !password) {
      showError('Please fill in all fields.');
      return;
    }

    // Check if email is already taken
    if (users.find(u => u.email === email) || email === ADMIN_EMAIL) {
      showError('This email is already registered.');
      return;
    }

    // Save new user to the list
    users.push({ name, email, password });
    localStorage.setItem('medical_users', JSON.stringify(users));

    showSuccess('Account created! Switching to login...');
    setTimeout(() => switchMode(), 1500);
  }
}

function switchMode() {
  clearMessages();
  // Clear inputs when switching
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('name').value = '';

  if (mode === 'login') {
    mode = 'signup';
    document.getElementById('form-title').textContent = 'Create an account';
    document.getElementById('form-subtitle').textContent = 'Sign up to get started today';
    document.getElementById('name-group').classList.remove('hidden');
    document.getElementById('submit-btn').textContent = 'Create Account';
    document.getElementById('switch-text').textContent = 'Already have an account?';
    document.getElementById('switch-btn-label').textContent = 'Sign in';
  } else {
    mode = 'login';
    document.getElementById('form-title').textContent = 'Welcome back';
    document.getElementById('form-subtitle').textContent = 'Sign in to your account to continue';
    document.getElementById('name-group').classList.add('hidden');
    document.getElementById('submit-btn').textContent = 'Sign In';
    document.getElementById('switch-text').textContent = "Don't have an account?";
    document.getElementById('switch-btn-label').textContent = 'Sign up';
  }
}

function togglePassword() {
  const input = document.getElementById('password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function showSuccess(msg) {
  const el = document.getElementById('success-msg');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function clearMessages() {
  const errorEl = document.getElementById('error-msg');
  const successEl = document.getElementById('success-msg');
  if (errorEl) errorEl.classList.add('hidden');
  if (successEl) successEl.classList.add('hidden');
}