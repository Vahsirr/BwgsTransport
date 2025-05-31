import OtpScreen from './OtpScreen';
import authRoles from '../../auth/authRoles';

const OtpConfig = {
  auth: authRoles.onlyGuest,
  routes: [
    {
      name: 'otp',
      component: OtpScreen,
    },
  ],
};

export default OtpConfig;
