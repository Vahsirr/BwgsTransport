import axios from 'axios';
import React from 'react';
import withAppProviders from './src/withAppProviders';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/themes/Theme';
import { AuthProvider } from './src/auth/AuthContext';
import { useSelector } from 'react-redux';
import { selectUser } from './src/slices/userSlice';
import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android'
// axios.defaults.baseURL = isAndroid ? "http://10.0.0.2:5000/" : "http://localhost:5000/"
axios.defaults.baseURL = 'https://bwgstransport.in/';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';



function App() {
  const user = useSelector(selectUser);
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator userRole={user.role} loginRedirectUrl={"dashboard"} />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}

export default withAppProviders(App)()
