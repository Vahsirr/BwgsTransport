import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const AppSplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.spinner}>
        <Animatable.View animation="bounce" iterationCount="infinite" style={styles.bounce} />
        <Animatable.View animation="bounce" iterationCount="infinite" style={styles.bounce} />
        <Animatable.View animation="bounce" iterationCount="infinite" style={styles.bounce} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    marginBottom: 50,
  },
  logo: {
    width: 128,
    height: 128,
  },
  spinner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: 60,
  },
  bounce: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6200ee',
    margin: 2,
  },
});

export default AppSplashScreen;
