import SignOutScreen from './SignOutScreen';
import authRoles from '../../auth/authRoles';

const SignOutConfig = {
  auth: authRoles.driverAndUser,
  routes: [
    {
      name: 'signOut',
      component: SignOutScreen,
    },
  ],
};

export default SignOutConfig;
