import axios from "axios";
import Cookies from "js-cookie";

const BASE = "http://localhost:8000";

// Attach JWT token from cookie to every request automatically
// NOTE: Do NOT set Content-Type here — axios must auto-set it for FormData
// (multipart/form-data with correct boundary) for image uploads to work
axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If sending FormData, delete any manually set Content-Type so axios
  // can set the correct multipart/form-data boundary automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export const login = (data) => axios.post(`${BASE}/login`, data);
export const logout = () => axios.get(`${BASE}/logout`);
export const getProfile = () => axios.get(`${BASE}/user/profile`);
export const updateProfile = (data) => axios.post(`${BASE}/user/updateProfile`, data);
export const changePassword = (data) => axios.post(`${BASE}/changePassword`, data);
export const getDashboardStats = () => axios.get(`${BASE}/admin/dashboardStats`);
export const getUsers = () => axios.get(`${BASE}/admin/users`);
export const updateUserStatus = (data) => axios.post(`${BASE}/admin/updateUserStatus`, data);
export const getAdminCategories = () => axios.get(`${BASE}/admin/categories`);
export const addCategory = (data) => axios.post(`${BASE}/admin/addCategory`, data);
export const updateCategory = (data) => axios.post(`${BASE}/admin/updateCategory`, data);
export const deleteCategory = (id) => axios.get(`${BASE}/admin/deleteCategory/${id}`);
export const getAdminServices = () => axios.get(`${BASE}/admin/services`);
export const addService = (data) => axios.post(`${BASE}/admin/addService`, data);
export const updateService = (data) => axios.post(`${BASE}/admin/updateService`, data);
export const deleteService = (id) => axios.get(`${BASE}/admin/deleteService/${id}`);
export const getBookings = () => axios.get(`${BASE}/admin/bookings`);
export const updateBooking = (data) => axios.post(`${BASE}/admin/updateBooking`, data);
export const getPayments = () => axios.get(`${BASE}/admin/payments`);
export const getFeedbacks = () => axios.get(`${BASE}/admin/feedbacks`);
