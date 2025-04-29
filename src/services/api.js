const API_URL = 'http://localhost:5000/api';

export const getNotes = async () => {
  try {
    const response = await fetch(`${API_URL}/notes`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Notlar alınamadı');
    }
    return response.json();
  } catch (error) {
    console.error('Notlar alınırken hata:', error);
    throw error;
  }
};

export const addNote = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Not eklenemedi');
    }
    return response.json();
  } catch (error) {
    console.error('Not eklenirken hata:', error);
    throw error;
  }
};

export const updateNote = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      body: formData
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Not güncellenemedi');
    }
    return response.json();
  } catch (error) {
    console.error('Not güncellenirken hata:', error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Not silinemedi');
    }
    return response.json();
  } catch (error) {
    console.error('Not silinirken hata:', error);
    throw error;
  }
};

export const decryptNote = async (id, password) => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Not açılamadı');
    }
    return response.json();
  } catch (error) {
    console.error('Not açılırken hata:', error);
    throw error;
  }
}; 