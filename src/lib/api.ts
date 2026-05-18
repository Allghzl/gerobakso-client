import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gerobakso.pinat.my.id/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  // Handle the case where response.data.data.available exists
  if (response.data.data && response.data.data.available) {
    return { data: response.data.data.available };
  }
  return response.data;
};

export const getTables = async () => {
  const response = await api.get('/tables');
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export default api;
