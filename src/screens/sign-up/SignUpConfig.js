import SignUpScreen from './SignUpScreen';
import authRoles from '../../auth/authRoles';

const SignUpConfig = {
  auth: authRoles.onlyGuest,
  routes: [
    {
      name: 'signUp',
      component: SignUpScreen,
    },
  ],
};

export default SignUpConfig;
