document.addEventListener('DOMContentLoaded', () => {
  // Check if token exists on load
  const token = localStorage.getItem('tms_token');
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('username') || document.getElementById('login-username');
      const passwordInput = document.getElementById('password') || document.getElementById('login-password');
      const errorDiv = document.getElementById('login-error');

      try {
        await api.login(usernameInput.value, passwordInput.value);
        if (errorDiv) errorDiv.textContent = '';
        window.location.reload();
      } catch (err) {
        if (errorDiv) {
          errorDiv.textContent = err.message || 'Invalid username or password';
        } else {
          alert('Login failed: ' + err.message);
        }
      }
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      api.logout();
    });
  }
});