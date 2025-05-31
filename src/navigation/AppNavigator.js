import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppContext from '../AppContext';
import AppAuthorization from '../utils/AppAuthorization';
import AppUtils from '../utils/AppUtils';
import AppMessage from '../components/AppMessage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ userRole, loginRedirectUrl }) => {
  const appContext = useContext(AppContext);
  const { routes } = appContext;

  return (
    <Stack.Navigator initialRouteName="dashboard">
      {routes.map((route) => {
        const userHasAccess = AppUtils.hasPermission(route.auth, userRole);
        if (!userHasAccess) {
          return null;
        }

        return (
          <Stack.Screen
            key={route.name}
            name={route.name}
            options={{ headerShown: false }}
          >
            {props => (
              <SafeAreaProvider>
                <AppMessage />
                <AppAuthorization userRole={userRole} loginRedirectUrl={loginRedirectUrl}>
                  {React.createElement(route.component, props)}
                </AppAuthorization>
              </SafeAreaProvider>
            )}
          </Stack.Screen>
        );
      })}
    </Stack.Navigator>
  );
};



export default AppNavigator;
