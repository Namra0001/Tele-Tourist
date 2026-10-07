function apiCall(endpoint, method = 'GET', data = null) {
  if (CONFIG.USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (endpoint.includes('/stories')) {
          resolve(MOCK_DATA.stories);
        } else if (endpoint.includes('/login') || endpoint.includes('/register')) {
          resolve({ token: 'mock-token-123', username: data ? data.username : 'MockUser' });
        } else {
          resolve({});
        }
      }, 500);
    });
  }

  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (data && (method === 'POST' || method === 'PUT')) {
      headers['Content-Type'] = 'application/json';
    }

    $.ajax({
      url: `${CONFIG.API_BASE_URL}${endpoint}`,
      method: method,
      headers: headers,
      data: data ? JSON.stringify(data) : null,
      success: resolve,
      error: reject
    });
  });
}
