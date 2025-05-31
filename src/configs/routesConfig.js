import AppUtils from '../utils/AppUtils';
import AppLoading from '../components/AppLoading';
import Dashboard from '../screens/dashboard/DashboardScreen';
import Error404 from '../screens/error/Error404Screen'
import SignInConfig from '../screens/sign-in/SignInConfig';
import SignUpConfig from '../screens/sign-up/SignUpConfig';
import SignOutConfig from '../screens/sign-out/SignOutConfig';
import TrackingConfig from '../screens/tracking/TrackingConfig';
import OtpConfig from '../screens/otp/OtpConfig';
import ProfileConfig from '../screens/profile/ProfileConfig';
import UserInstructions from '../screens/user-instructions/UserInstructionsConfig';

const routeConfigs = [
  SignInConfig,
  SignUpConfig,
  SignOutConfig,
  TrackingConfig,
  OtpConfig,
  ProfileConfig,
  UserInstructions
];

const routes = [
  ...AppUtils.generateRoutesFromConfigs(routeConfigs, ['user', 'driver']),
  {
    name: 'dashboard',
    component: Dashboard,
    auth: ['user', 'driver'],
  },
  {
    name: 'loading',
    component: AppLoading,
  },
  {
    name: 'error404',
    component: Error404,
  },
];

export default routes;
