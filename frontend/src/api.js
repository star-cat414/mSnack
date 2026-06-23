const BASE_URL = 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Public
  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    return res.json();
  },

  async getSnacks(categoryId = null) {
    const url = categoryId ? `${BASE_URL}/snacks?category_id=${categoryId}` : `${BASE_URL}/snacks`;
    const res = await fetch(url);
    return res.json();
  },

  // Auth
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  // Admin CRUD
  async createCategory(categoryData) {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async createSnack(snackData) {
    const res = await fetch(`${BASE_URL}/snacks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(snackData)
    });
    if (!res.ok) throw new Error('Failed to create snack');
    return res.json();
  },

  async updateSnack(id, snackData) {
    const res = await fetch(`${BASE_URL}/snacks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(snackData)
    });
    if (!res.ok) throw new Error('Failed to update snack');
    return res.json();
  },

  async deleteSnack(id) {
    const res = await fetch(`${BASE_URL}/snacks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete snack');
    return true;
  }
};