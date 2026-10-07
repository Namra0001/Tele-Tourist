function login(username, password) {
  return apiCall('/login', 'POST', { username, password }).then(res => {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', res.username || username);
    }
    return res;
  });
}

function register(username, email, password) {
  return apiCall('/register', 'POST', { username, email, password }).then(res => {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', res.username || username);
    }
    return res;
  });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function isAuthenticated() {
  return !!localStorage.getItem('token');
}
