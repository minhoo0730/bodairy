import axiosInstance from './index';

export default {
  register: async req => {
    return await axiosInstance.post('/api/register', req);
  },
  login: async req => {
    return await axiosInstance.post('/api/login', req);
  },
  logout: async refreshToken => {
    return await axiosInstance.post('/api/logout', { refresh_token: refreshToken });
  },

  fetchUser:async () => {
    return await axiosInstance.get('/api/me')
  },

  refresh:async refreshToken => {
    return await axiosInstance.post('/api/refresh', { refresh_token: refreshToken })
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
  },
  findEmail:async req => {
    const response = await axiosInstance.post('/api/find-email', req)
    return response;
  }
};
