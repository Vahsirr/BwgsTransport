import UserInstructionsScreen from './UserInstructionsScreen';
import authRoles from '../../auth/authRoles';

const UserInstructionsConfig = {
  auth: authRoles.driverAndUser,
  routes: [
    {
      name: 'UserInstructions',
      component: UserInstructionsScreen,
    },
  ],
};

export default UserInstructionsConfig;
