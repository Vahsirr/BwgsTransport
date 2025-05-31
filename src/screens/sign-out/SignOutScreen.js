import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Card } from 'react-native-paper';
import JwtService from '../../auth/services/jwtService';
import theme from '../../themes/Theme';

function SignOutScreen() {
  useEffect(() => {
    setTimeout(() => {
      JwtService.logout();
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <Image
            style={styles.logo}
            // source={require('../../assets/images/logo/logo.png')}
          />
          <Text style={styles.message}>You have signed out!</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundColor,
  },
  card: {
    width: '90%',
    maxWidth: 320,
    backgroundColor: theme.colors.backgroundColorSecond,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default SignOutScreen;
