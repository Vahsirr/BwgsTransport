import AsyncStorage from '@react-native-async-storage/async-storage';

const sessionStorageKey = 'appRedirectUrl';

export const getSessionRedirectUrl = async () => {
  try {
    const url = await AsyncStorage.getItem(sessionStorageKey);
    return url;
  } catch (error) {
    console.error('Error getting session redirect URL:', error);
    return null;
  }
};

export const setSessionRedirectUrl = async (url) => {
  try {
    await AsyncStorage.setItem(sessionStorageKey, url);
  } catch (error) {
    console.error('Error setting session redirect URL:', error);
  }
};

export const resetSessionRedirectUrl = async () => {
  try {
    await AsyncStorage.removeItem(sessionStorageKey);
  } catch (error) {
    console.error('Error resetting session redirect URL:', error);
  }
};
