import SignInScreen from './SignInScreen';
import authRoles from '../../auth/authRoles';

const SignInConfig = {
  auth: authRoles.onlyGuest,
  routes: [
    {
      name: 'signIn',
      component: SignInScreen,
    },
  ],
};

export default SignInConfig;
