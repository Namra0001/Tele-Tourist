function login(email, password) {
  return apiCall('/auth/login', 'POST', { email, password }).then(res => {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', res.user ? res.user.name : email);
    }
    return res;
  });
}

function register(name, email, password) {
  return apiCall('/auth/register', 'POST', { name, email, password }).then(res => {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', res.user ? res.user.name : email);
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
