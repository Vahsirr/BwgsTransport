const jwtServiceConfig = {
    signIn: '/api/users/login',
    signUp: '/api/users',
    accessToken: '/api/users/token-login',
    updateUser: 'api/auth/user/update',
    updateLocation:'/api/users/update-location',
    getLocation:'/api/users/get-location',
    sendOtp: '/api/users/send-otp',
    verifyOtp: '/api/users/verify-otp',
    deleteAccount: '/api/users/delete-account' 
  };
  
  export default jwtServiceConfig;
  