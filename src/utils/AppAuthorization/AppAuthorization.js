import React, { useEffect, useState, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSessionRedirectUrl, setSessionRedirectUrl, resetSessionRedirectUrl } from './sessionRedirectUrl';
import AppUtils from '../AppUtils';
import AppContext from '../../AppContext';

const AppAuthorization = ({ userRole, loginRedirectUrl, children }) => {
  const [accessGranted, setAccessGranted] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { routes } = useContext(AppContext);

  useEffect(() => {
    checkAccess();
  }, [userRole, route.name]);

  async function checkAccess() {

    const pathname = route.name;
    const matchedRoute = routes.find(r => r.name === pathname);
    const userHasPermission = matchedRoute
      ? AppUtils.hasPermission(matchedRoute.auth, userRole)
      : userRole.length === 0;

    const ignoredPaths = ['signIn', 'signOut', 'logout', 'notFound'];

    if (!userHasPermission && matchedRoute && !ignoredPaths.includes(pathname)) {
      await setSessionRedirectUrl(pathname);
      setAccessGranted(false);
      await redirectRoute();
      return;
    } 

    setAccessGranted(true);
  }

  async function redirectRoute() {
    const redirectUrl = (await getSessionRedirectUrl()) || loginRedirectUrl;

    try {
      if (!userRole || userRole.length === 0) {
        navigation.navigate('signIn');
      } else {
        navigation.navigate(redirectUrl);
        resetSessionRedirectUrl();
      }
    } catch (error) {
      console.error('Error during redirection:', error);
    }
  }

  return accessGranted ? children : null;
};

export default AppAuthorization;
