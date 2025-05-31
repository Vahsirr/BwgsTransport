import TrackingScreen from './TrackingScreen';
import authRoles from '../../auth/authRoles';

const TrackingConfig = {
  auth: authRoles.driverAndUser,
  routes: [
    {
      name: 'tracking',
      component: TrackingScreen,
    },
  ],
};

export default TrackingConfig;
