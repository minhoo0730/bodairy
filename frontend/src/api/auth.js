import axiosInstance from './index';

export default {
  login: async req => {
    return await axiosInstance.post('/api/login', req);
  },
  logout: async () => {
    return await axiosInstance.post('/api/logout');
  },

  fetchUser:async () => {
    return await axiosInstance.get('/api/me')
  },

  requestOtp:async req => {
    const response = await axiosInstance.post('/api/request-otp', req)
    return response;
  },  

  verifyOtp:async req => {
    const response = await axiosInstance.post('/api/verify-otp', req)
    return response;
  },  

  resetPassword:async req => {
    const response = await axiosInstance.post('/api/reset-password', req)
    return response;
  }
};
