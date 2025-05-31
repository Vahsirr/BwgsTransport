import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import AppSplashScreen from '../components/AppSplashScreen';
import { showMessage } from '../slices/messageSlice';
import { logoutUser, setUser } from '../slices/userSlice';
import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAutoLogin = jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));

      jwtService.signInWithToken()
        .then((user) => {
          handleSuccess(user, 'Signed in');
        })
        .catch((error) => {
          handlePass(error.message);
        });
    });

    const unsubscribeLogin = jwtService.on('onLogin', (user) => {
      handleSuccess(user, 'Signed in');
    });

    const unsubscribeLogout = jwtService.on('onLogout', () => {
      handlePass('Signed out');
      dispatch(logoutUser());
    });

    const unsubscribeAutoLogout = jwtService.on('onAutoLogout', (message) => {
      handlePass(message);
      dispatch(logoutUser());
    });

    const unsubscribeNoAccessToken = jwtService.on('onNoAccessToken', () => {
      handlePass();
    });

    jwtService.init();

    return () => {
      unsubscribeAutoLogin();
      unsubscribeLogin();
      unsubscribeLogout();
      unsubscribeAutoLogout();
      unsubscribeNoAccessToken();
    };
  }, [dispatch]);

  const handleSuccess = (user, message) => {
    if (message) {
      dispatch(showMessage({ message, variant: "success" }));
    }

    Promise.all([
      dispatch(setUser(user)),
    ]).then(() => {
      setWaitAuthCheck(false);
      setIsAuthenticated(true);
    });
  };

  const handlePass = (message) => {
    if (message) {
      dispatch(showMessage({ message }));
    }

    setWaitAuthCheck(false);
    setIsAuthenticated(false);
  };

  return waitAuthCheck ? (
    <View style={{ flex: 1 }}>
      <AppSplashScreen />
    </View>
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
