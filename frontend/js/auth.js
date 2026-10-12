function login(email, password) {
  return apiCall('/auth/login', 'POST', { email, password }).then(res => {
    if (res.token) {
      localStorage.setItem('token', res.token);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        localStorage.setItem('user', JSON.stringify({ email }));
      }
    }
    return res;
  });
}

function register(name, email, password) {
  return apiCall('/auth/register', 'POST', { name, email, password }).then(res => {
    if (res.token) {
      localStorage.setItem('token', res.token);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      } else {
        localStorage.setItem('user', JSON.stringify({ name, email }));
      }
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
