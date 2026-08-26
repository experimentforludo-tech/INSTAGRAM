document.getElementById('telegramForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  const responseDiv = document.getElementById('responseMsg');

  if (!username || !phone) {
    responseDiv.innerHTML = '⚠️ Username and phone are required.';
    responseDiv.style.color = '#ed4956';
    return;
  }

  const payload = { username, phone, message };

  try {
    const res = await fetch('http://localhost:5000/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      responseDiv.innerHTML = '✅ ' + data.message;
      responseDiv.style.color = '#28a745';
      document.getElementById('telegramForm').reset();
    } else {
      responseDiv.innerHTML = '❌ ' + data.error;
      responseDiv.style.color = '#ed4956';
    }
  } catch (err) {
    responseDiv.innerHTML = '❌ Server not reachable.';
    responseDiv.style.color = '#ed4956';
  }
});