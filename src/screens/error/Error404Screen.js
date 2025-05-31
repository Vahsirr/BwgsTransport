import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Error404Screen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 Not Found</Text>
      <Text style={styles.message}>Oops! The page you're looking for does not exist.</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Error404Screen;
