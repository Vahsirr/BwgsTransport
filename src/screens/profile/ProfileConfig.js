import ProfileScreen from './ProfileScreen';
import authRoles from '../../auth/authRoles';

const ProfileConfig = {
  auth: authRoles.driverAndUser,
  routes: [
    {
      name: 'profile',
      component: ProfileScreen,
    },
  ],
};

export default ProfileConfig;
